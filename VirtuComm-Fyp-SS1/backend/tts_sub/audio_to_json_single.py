import whisper
import json

def transcribe_audio(audio_file, model_name="base"):
    model = whisper.load_model(model_name)
    return model.transcribe(audio_file, word_timestamps=True)


def transcription_to_json(result):
    """
    Converts transcription results to JSON without speaker tagging.
    Args:
        result (dict): Transcription result from Whisper.
    Returns:
        dict: JSON structure with transcription data.
    """
    json_data = {"segments": []}

    for segment in result["segments"]:
        segment_text = segment["text"].strip()
        segment_start = segment["start"]
        segment_end = segment["end"]

        # Process the words with timestamps
        word_data = [
            {
                "word": word["word"],
                "start_time": word["start"],
                "end_time": word["end"],
                "duration": word["end"] - word["start"]
            }
            for word in segment["words"]
        ]

        # Add the segment without speaker information
        segment_data = {
            "start_time": segment_start,
            "end_time": segment_end,
            "text": segment_text,
            "words": word_data,
            "speaker":"Smith"
        }
        json_data["segments"].append(segment_data)

    return json_data


def save_json(data, file_name="output_transcription.json"):
    with open(file_name, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"JSON file saved as '{file_name}'")

def audio_to_json_single(audio_file, whisper_model, transcription_path):
    result = whisper_model.transcribe(audio_file, word_timestamps=True)
    json_data = transcription_to_json(result)
    save_json(json_data, file_name=transcription_path)
