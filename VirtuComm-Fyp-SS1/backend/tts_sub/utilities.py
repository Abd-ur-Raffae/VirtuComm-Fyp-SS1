import os
from .apps import resources 
from concurrent.futures import ThreadPoolExecutor, as_completed
import subprocess
import requests
import shutil
from dotenv import load_dotenv
from .audio_to_json import transcribe_audio_api
from .voiceGen import student,teacher,applicant,interviewr,guest, host

  # assuming this contains get_chat_api_url()

def gen_dialogue(text, scnerioTitle):
    """
    Generates a dialogue via the /chat endpoint IF no existing
    '[' or ']' are found in the text.
    """
    load_dotenv()
    API_KEY = os.getenv("API_key")  # NOTE: match the exact casing you used in .env

    if not API_KEY:
        raise RuntimeError("API_key not found in environment variables")

    if "[" not in text or "]" not in text:
        prompt = get_prompt_for(scnerioTitle)
        payload = {
            "system_message": prompt,
            "message": text,
        }
        resp = requests.post(
            resources.get_chat_api_url(),
            json=payload,
            headers={
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            timeout=10
        )
        resp.raise_for_status()
        return resp.json()["response"].strip()
    return None



def get_prompt_for(text):
    text = text.lower()
    if text == "podcast":
        return (
            "Generate a very short dialogue between two male characters "
            "participating in the podcast. One character is the host, "
            "and the other is the guest. The dialogue should include "
            "discussion about the given topic (make it sound as practical "
            "as possible, even if the input is the same try to generate "
            "different results). Use these labels ([host] and [guest]) "
            "at the start of every individual's turn. The host asks "
            "general questions and the guest answers them, both keeping "
            "the dialogue interesting, engaging and natural. End the "
            "dialogue in 10 to 15 lines. Dont add any kind of explanatory phrases. example: [guest] hello, thank "
            "you for coming! [host] it's my pleasure."
        )
    elif text == "interview":
        return (
            "Generate a very short dialogue between two characters "
            "conducting an interview. One character is the interviewer, "
            "and the other is the applicant. Use these labels "
            "([interviewer] and [Applicant]) at the start of every "
            "individual's turn. The interviewer asks relevant and tough "
            "questions about the given topic, and the applicant provides "
            "concise answers. Keep the dialogue engaging, natural, and "
            "end the dialogue in 10 to 15 lines. example: "
            "[Interviewer] hello, thank you for coming! [Applicant] it's "
            "my pleasure"
        )
    elif text == "stu_teach":
        return (
            "You are a chatbot which only replies shortly. You give "
            "different results every time and in the form of a dialogue "
            "between two characters talking about the given topic in just "
            "10 to 15 lines. When starting each person's dialogue, only "
            "start it with: '[student]' or '[teacher]'. If you mention the "
            "names again, don't use brackets—brackets only come when "
            "starting the sentence. example: [student] how are you teacher? "
            "[teacher] I am good what about you? what brought you here today?"
        )
    else:
        return ""

def get_recommended_links(query):
    try:
        print("Initializing links client...")
        links = resources.get_links_client()

        if not links:
            print("Error: get_links_client() returned None.")
            return []

        print(f"Calling predict() with query: {query}")
        try:
            result = links.predict(query=query, api_name="/predict")
            print(f"Received result: {result}")

            if "web_links" in result and "youtube_links" in result:
                print(f"Web Links: {result['web_links']}")
                print(f"YouTube Links: {result['youtube_links']}")
            else:
                print("Error: Unexpected API response structure.")

            return result
        except Exception as e:
            print(f"Error during predict() call: {e}")
            return []

    except Exception as e:
        print(f"Unexpected error in get_recommended_links: {e}")
        return []
    


def generate_lipsync_for_single(audio_file):
    base, _ = os.path.splitext(audio_file)
    json_file = f"{base}_lipsync.json"

    if not os.path.exists(audio_file):
        print(f"[ERROR] Audio not found: {audio_file}")
        return None

    rhubarb_path = os.path.join("Rhubarb-Lip-Sync-1.13.0-Windows", "rhubarb.exe")
    command = [rhubarb_path, "-f", "json", audio_file, "-o", json_file]

    try:
        subprocess.run(command, check=True, capture_output=True, text=True)
        if os.path.exists(json_file):
            print(f"[✓] Lipsync JSON generated: {json_file}")
            return json_file
        else:
            print(f"[ERROR] Expected output not found: {json_file}")
            return None
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Rhubarb failed on {audio_file}")
        print(e.stderr)
        return None
    except Exception as e:
        print(f"[ERROR] Unexpected failure on {audio_file}: {e}")
        return None


def generate_lipsync_batch(audio_files, max_workers=None):
    """
    Generates lipsync JSONs for all provided audio files in parallel.
    Returns a dictionary: {audio_file_path: lipsync_json_path}
    """
    results = {}

    with ThreadPoolExecutor(max_workers=max_workers or len(audio_files)) as executor:
        future_to_audio = {
            executor.submit(generate_lipsync_for_single, audio): audio
            for audio in audio_files
        }
        for future in as_completed(future_to_audio):
            audio = future_to_audio[future]
            try:
                result = future.result()
                if result:
                    results[audio] = result
            except Exception as e:
                print(f"[ERROR] Future failed for {audio}: {e}")

    return results




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
            elif error_speaker.lower() == "applicant":
                applicant(error_text)
                generated_file = "applicant_file.wav"
            elif error_speaker.lower() == "interviewer":
                interviewr(error_text)
                generated_file = "interviewer_file.wav"
            elif error_speaker.lower() == "host":
                host(error_text)
                generated_file = "host_file.wav"
            elif error_speaker.lower() == "guest":
                guest(error_text)
                generated_file = "guest_file.wav"

            else:
                print(f"Unknown speaker type: {error_speaker}")
                continue  

            print(f"Generated file is: {generated_file}")

            rename_move(generated_file, output_path, filename)

            # Pass full absolute path
            full_path = os.path.abspath(os.path.join(output_path, filename))


            with ThreadPoolExecutor(max_workers=2) as executor:
                future_transcription = executor.submit(transcribe_audio_api,full_path)
                future_lipsync = executor.submit(generate_lipsync_for_single,full_path)

                transcription_result = future_transcription.result()
                lipsync_result  =future_lipsync.result()


            segment.pop("error",None)
            segment["audio"] = full_path
            segment["transcription"] = transcription_result
            segment["lipsync"] = lipsync_result

    remove_garbage("../")
    remove_garbage("../media/interview")
    remove_garbage("../media/podcast")
    remove_garbage("../media/stu_teach")
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

