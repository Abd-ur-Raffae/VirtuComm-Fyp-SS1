import os,re
import json
import subprocess

def generate_text(convo_client, text):
    """
    Generates dialogue using the conversation client if the input text is not already in dialogue format.
    """
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