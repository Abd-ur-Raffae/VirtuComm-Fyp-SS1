import os,json
from gradio_client import handle_file


def transcribe_audio_api(audio, whisper_client):
    """
    Calls the Whisper API to transcribe an audio file, saves the transcription result
    as a JSON file (with '_sub' appended to the base filename) in the same folder as the audio,
    and returns the raw transcription result.
    """
    try:
        print(f"Transcribing {audio} via API...")
        result = whisper_client.predict(
            audio_file=handle_file(audio),
            api_name="/predict"
        )
        # Create the JSON filename by appending "_sub" before the extension
        base, ext = os.path.splitext(audio)
        json_filename = f"{base}_sub.json"
        with open(json_filename, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
        print(f"Transcription saved to: {json_filename}")
        return result
    except Exception as e:
        print(f"Error transcribing {audio}: {e}")
        return None
