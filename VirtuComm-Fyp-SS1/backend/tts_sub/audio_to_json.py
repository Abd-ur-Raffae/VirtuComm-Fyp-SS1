import whisper
import json
from difflib import SequenceMatcher

def transcribe_audio(audio_file, model_name="base"):
    model = whisper.load_model(model_name)
    return model.transcribe(audio_file, word_timestamps=True)


def transcription_to_json(result, metadata):
    """
    Converts transcription results to JSON with metadata-based speaker tagging.
    Args:
        result (dict): Transcription result from Whisper.
        metadata (list): Metadata from the audio generation step.
    Returns:
        dict: JSON structure with speaker tags and transcription data.
    """
    json_data = {"segments": []}

    def find_closest_speaker(segment_text):
        """
        Finds the speaker whose metadata text matches the segment_text most closely.
        Args:
            segment_text (str): The transcription segment text.
        Returns:
            str: The speaker (e.g., "student" or "teacher").
        """
        best_match = {"speaker": "Unknown", "ratio": 0}
        for meta in metadata:
            match_ratio = SequenceMatcher(None, segment_text, meta["text"]).ratio()
            if match_ratio > best_match["ratio"]:
                best_match = {"speaker": meta["speaker"], "ratio": match_ratio}
        return best_match["speaker"]

    for segment in result["segments"]:
        segment_text = segment["text"].strip()
        segment_start = segment["start"]
        segment_end = segment["end"]

        # Find the closest matching speaker using fuzzy logic
        speaker = find_closest_speaker(segment_text)

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

        # Add the segment with speaker and corrected text
        segment_data = {
            "start_time": segment_start,
            "end_time": segment_end,
            "text": segment_text,
            "words": word_data,
            "speaker": speaker
        }
        json_data["segments"].append(segment_data)

    return json_data

def save_json(data, file_name="output_transcription.json"):
    with open(file_name, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"JSON file saved as '{file_name}'")

def audio_to_json(audio_file, metadata, whisper_model, transcription_path):
    result = whisper_model.transcribe(audio_file, word_timestamps=True)
    json_data = transcription_to_json(result, metadata)
    save_json(json_data, file_name=transcription_path)

