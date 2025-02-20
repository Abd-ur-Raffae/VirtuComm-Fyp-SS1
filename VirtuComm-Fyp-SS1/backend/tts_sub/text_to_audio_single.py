import os
from concurrent.futures import ThreadPoolExecutor
from pydub import AudioSegment
from .voiceGen import student  
import shutil
import time


def generate_audio_from_plain_text(text, output_path):
    """
    Generates audio from plain text using a single TTS function.
    """
    output_dir = os.path.join("tts_sub", "plain_text_audio")
    os.makedirs(output_dir, exist_ok=True)

    temp_audio_file = os.path.join(output_dir, "temp_audio.wav")

    try:
        print(f"Generating audio for plain text: {text}")
  
        student(text)  
        generated_file = "student_file.wav"

        # Check if the generated file exists
        retries = 5
        for _ in range(retries):
            if os.path.exists(generated_file):
                shutil.move(generated_file, temp_audio_file)
                print(f"Generated audio: {temp_audio_file}")
                break
            else:
                time.sleep(0.5)  # Wait briefly for the file to appear
        else:
            print(f"Error: Generated file '{generated_file}' not found.")
            return None

        # Concatenate audio (in case multiple lines are processed)
        final_audio = AudioSegment.from_file(temp_audio_file)
        final_audio.export(output_path, format="wav")
        print(f"Final audio saved as: {output_path}")

   

    except Exception as e:
        print(f"Error processing plain text audio: {e}")

    finally:
        # Cleanup temporary directory
        cleanup_generated_files([temp_audio_file], output_dir)




def cleanup_generated_files(files, output_dir):
    """
    Deletes temporary files and cleans up the directory.
    """
    try:
        for file in files:
            if os.path.exists(file):
                os.remove(file)
        if os.path.exists(output_dir):
            os.rmdir(output_dir)
        print(f"Cleaned up directory: {output_dir}")
    except Exception as e:
        print(f"Error during cleanup: {e}")
