import whisper
from .apps import resources
from gradio_client import handle_file
import json


def save_json(data, file_name="output_transcription.json"):
    with open(file_name, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"JSON file saved as '{file_name}'")



def audio_to_sub_single(audio):
    whisper_client = resources.get_whisper_client()
    try:
        print(f"Transcribing {audio} via API...")
        result = whisper_client.predict(
            audio_file=handle_file(audio),
            api_name="/predict"
        )
        # Create the JSON filename by appending "_sub" before the extension
        result["speaker"] = "Smith"
        save_json(result,"media/output_transcription_single.json")
        return result
    except Exception as e:
        print(f"Error transcribing {audio}: {e}")
        return None