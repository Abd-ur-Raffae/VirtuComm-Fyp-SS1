import os,re
from .apps import resources 
from concurrent.futures import ThreadPoolExecutor
import subprocess
import shutil
from .audio_to_json import transcribe_audio_api
from .voiceGen import student,teacher,process_audio_file


def generate_text(text):
    """
    Generates dialogue using the conversation client if the input text is not already in dialogue format.
    """
    convo_client = resources.get_convo_client()
    if "[" not in text or "]" not in text:
        system_message = (
            "You are a chatbot which only replies shortly. You give different results every time "
            "and in the form of a dialogue between two characters talking about the given topic in "
            "just 10 to 15 lines. When starting each person's dialogue, only start it with: "
            "'[student]' or '[teacher]'. If you mention the names again, don't use brackets, "
            "brackets only come when starting the sentence."
        )
        result = convo_client.predict(
            message=text,
            system_message=system_message,
            max_tokens=512,
            temperature=0.7,
            top_p=0.95,
            api_name="/chat"
        )
        return result.strip()
    return text


def generate_lipsync_for_patch(audio_file):
    """
    Generates a Rhubarb Lip Sync JSON file for a single audio patch.
    The generated JSON file is saved in the same folder as the audio file, with the audio's base name
    extended by '_lipsync.json'. Returns the path to the generated JSON file.
    """
    base, ext = os.path.splitext(audio_file)
    json_file = f"{base}_lipsync.json"
    
    if not os.path.exists(audio_file):
        print(f"Error: Audio file not found at {audio_file}")
        return None
    
    try:
        # Construct the full path to the rhubarb executable
        rhubarb_path = os.path.join("Rhubarb-Lip-Sync-1.13.0-Windows", "rhubarb.exe")
        
        # Define the command as a list of arguments
        command = [
            rhubarb_path,
            "-f", "json",
            audio_file,
            "-o", json_file
        ]

        # Run the command using subprocess.run
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        
        # Verify that the JSON file was created at the desired location.
        if os.path.exists(json_file):
            print(f"Lip sync JSON generated: {json_file}")
            return json_file
        else:
            print(f"Error: Expected lipsync JSON not found at {json_file}")
            return None
    except subprocess.CalledProcessError as e:
        print(f"Error generating lipsync for {audio_file}: {e}")
        print(f"Command output: {e.stdout}")
        print(f"Command error: {e.stderr}")
        return None
    except Exception as e:
        print(f"Unexpected error generating lipsync for {audio_file}: {e}")
        return None

def formatQuerySuggester(text):
    pattern = re.compile(r'\[Question (\d+)\] (.+?)(?=\n\[Question \d+\]|\Z)', re.DOTALL)
    matches = pattern.findall(text)
    
    # Convert matches into a dictionary
    result = {f'Question {num}': question.strip() for num, question in matches}
    
    return result


def recheck_for_errors(pipeline_results, output_path):
    for segment in pipeline_results:
        if "error" in segment or segment.get("transcription") is None or not segment.get("lipsync"):

            error_index = segment["index"]
            error_text = segment["text"]
            error_speaker = segment["speaker"].lower()  
            filename = f"{error_index:03d}_{error_speaker}.wav"
            print(f"Failed audio: {filename}")

            if error_speaker == "teacher":
                generated_file = "teacher_file.wav"
                teacher(error_text)
            elif error_speaker == "student":
                generated_file = "student_file.wav"
                student(error_text)
            else:
                print(f"Unknown speaker type: {error_speaker}")
                continue  

            print(f"Generated file is: {generated_file}")

            rename_move(generated_file, output_path, filename)

            # Pass full absolute path
            full_path = os.path.abspath(os.path.join(output_path, filename))


            with ThreadPoolExecutor(max_workers=2) as executor:
                future_transcription = executor.submit(transcribe_audio_api,full_path)
                future_lipsync = executor.submit(generate_lipsync_for_patch,full_path)

                transcription_result = future_transcription.result()
                lipsync_result  =future_lipsync.result()


            segment.pop("error",None)
            segment["audio"] = full_path
            segment["transcription"] = transcription_result
            segment["lipsync"] = lipsync_result

    remove_garbage("../")
    return pipeline_results

def rename_move(source, destination, filename):
    if os.path.exists(source):
        new_path = os.path.join(destination, filename)
        shutil.move(source, new_path)
        print(f"File is located at: {new_path}")
    else:
        print(f"Error: Source file '{source}' not found.")



def remove_garbage(directory):
    """Remove all .mp3 files from the specified directory (backend/)."""
    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), directory))
    for file in os.listdir(backend_dir):
        if file.endswith(".mp3"):
            file_path = os.path.join(backend_dir, file)
            os.remove(file_path)
            print(f"Deleted MP3: {file_path}")

