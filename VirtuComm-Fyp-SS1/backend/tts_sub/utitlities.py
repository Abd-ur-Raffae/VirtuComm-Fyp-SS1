
import os,subprocess
import re
def generate_lipsync_json_for_final_audio(audio_file):
    """
    Generates a Rhubarb Lip Sync JSON file for the final concatenated audio.
    """
    json_file = f"{os.path.splitext(audio_file)[0]}.json"
    try:
        if not os.path.exists(audio_file):
            print(f"Error: Audio file not found at {audio_file}")
            return None

        print(f"Generating Rhubarb Lip Sync JSON for {audio_file}")
        
        # Command to run Rhubarb
        command = ["./Rhubarb-Lip-Sync-1.13.0-Windows/rhubarb","-f", "json",audio_file,"-o", json_file]
        print(f"Running command: {' '.join(command)}")
        
        # Execute the command
        subprocess.run(command, check=True)
        print(f"Generated JSON: {json_file}")
        return json_file
    except subprocess.CalledProcessError as e:
        print(f"Error generating Rhubarb Lip Sync JSON for {audio_file}: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    return None

def formatQuerySuggester(text):
    pattern = re.compile(r'\[Question (\d+)\] (.+?)(?=\n\[Question \d+\]|\Z)', re.DOTALL)
    matches = pattern.findall(text)
    
    # Convert matches into a dictionary
    result = {f'Question {num}': question.strip() for num, question in matches}
    
    return result