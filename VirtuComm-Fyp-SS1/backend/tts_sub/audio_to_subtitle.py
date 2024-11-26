def transcribe_audio(audio_file, model_name="base"):
    import whisper
    model = whisper.load_model(model_name)
    return model.transcribe(audio_file, word_timestamps=True)

def transcription_to_json(result):
    json_data = {"segments": []}
    for segment in result['segments']:
        segment_data = {
            "start_time": segment['start'],
            "end_time": segment['end'],
            "text": segment['text'],
            "words": [
                {
                    "word": word_info['word'],
                    "start_time": word_info['start'],
                    "end_time": word_info['end'],
                    "duration": word_info['end'] - word_info['start']
                }
                for word_info in segment['words']
            ]
        }
        json_data["segments"].append(segment_data)
    return json_data

def save_json(data, file_name="output_transcription1.json"):
    import json
    with open(file_name, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"JSON file saved as '{file_name}'")
    
def audio_to_json(audio_file):
    result = transcribe_audio(audio_file)
    json_data = transcription_to_json(result)
    save_json(json_data)

