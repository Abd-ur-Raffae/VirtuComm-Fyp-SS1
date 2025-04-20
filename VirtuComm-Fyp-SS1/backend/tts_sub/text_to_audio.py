import os
import re
from .apps import resources
import shutil
from concurrent.futures import ThreadPoolExecutor
from pydub import AudioSegment
from . utilities import generate_lipsync_for_patch
from .audio_to_json import transcribe_audio_api  # Import the transcription module


from .voiceGen import student, teacher, applicant, interviewr, guest, host  # Your TTS functions

def text_to_conversation_with_tags(text):
    """
    Converts text with speaker tags into a list of (speaker, line) tuples.
    """
    pattern = r"\[([^\]]+)\]\s*(.*)"
    matches = re.findall(pattern, text)
    return [(speaker.strip(), sentence.strip()) for speaker, sentence in matches]

def generate_audio_for_sentence(speaker, line_text, index, output_dir):
    """
    Generates the audio file for a single sentence.
    """
    output_file = os.path.join(output_dir, f"{index:03d}_{speaker}.wav")
    temp_file = os.path.join(output_dir, f"temp_{index}.wav")
    try:
        print(f"Generating audio for {speaker}: {line_text}")
        if speaker.lower() == "student":
            student(line_text)
            generated_file = "student_file.wav"

        elif speaker.lower() == "teacher":
            teacher(line_text)
            generated_file = "teacher_file.wav"

        elif speaker.lower() == "applicant":
            applicant(line_text)
            generated_file = "applicant_file.wav"

        elif speaker.lower() == "interviewer":
            interviewr(line_text)
            generated_file = "interviewer_file.wav"

        elif speaker.lower() == "guest":
            guest(line_text)
            generated_file = "guest_file.wav"

        elif speaker.lower() == "host":
            host(line_text)
            generated_file = "host_file.wav"
        

            
        else:
            print(f"Warning: Unrecognized speaker '{speaker}'")
            return None

        # Wait for the generated file to appear and then move/rename it.
        retries = 5
        for _ in range(retries):
            if os.path.exists(generated_file):
                shutil.move(generated_file, temp_file)
                os.rename(temp_file, output_file)
                print(f"Generated and renamed: {output_file}")
                return output_file
            # else:
            #     time.sleep(0.5)
        print(f"Error: File '{generated_file}' not found after retries for {speaker}.")
    except Exception as e:
        print(f"Error generating audio for {speaker}: {e}")
    return None

def process_line_pipeline(speaker, line_text, index, output_dir, whisper_client):
    """
    Processes a single conversation line:
      1. Generate audio.
      2. Transcribe the audio.
      3. Generate lip sync JSON.
    Returns a dictionary with the results.
    """
    result = {"speaker": speaker, "text": line_text, "index": index}
    audio_file = generate_audio_for_sentence(speaker, line_text, index, output_dir)
    if not audio_file:
        result["error"] = "Audio generation failed"
        return result
    result["audio_file"] = audio_file

    with ThreadPoolExecutor(max_workers=2) as executor:
        future_transcription = executor.submit(transcribe_audio_api,audio_file)
        future_lipsync = executor.submit(generate_lipsync_for_patch,audio_file)

        # Get the results
        result["transcription"] = future_transcription.result()
        result["lipsync"] = future_lipsync.result()

    return result

def process_conversation_pipeline(text, output_dir, max_workers):
    """
    Processes the entire conversation:
      - Parses the dialogue.
      - For each line, concurrently generates audio, transcribes it, and creates lip sync JSON.
    Returns a list of result dictionaries.
    """
    whisper_client = resources.get_whisper_client()
    conversation = text_to_conversation_with_tags(text)
    if not conversation:
        print("Error: No valid conversation found in the text.")
        return []

       
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)

    # Create a new empty folder
    os.makedirs(output_dir, exist_ok=True)

    results = []
    args = [(speaker, line_text, i, output_dir, whisper_client)
            for i, (speaker, line_text) in enumerate(conversation)]
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(process_line_pipeline, *arg) for arg in args]
        for future in futures:
            res = future.result()
            results.append(res)
    results.sort(key=lambda x: x.get("index", 0))
    return results
