import os
from concurrent.futures import ThreadPoolExecutor
from .voiceGen import student, teacher  # Import your TTS functions
from pydub import AudioSegment
import re
import shutil
import time


def text_to_conversation_with_tags(text):
    """
    Converts a text with explicit speaker tags into a conversation dictionary.
    """
    pattern = r"\[([^\]]+)\]\s*(.*)"
    matches = re.findall(pattern, text)
    return [(speaker.strip(), sentence.strip()) for speaker, sentence in matches]


def generate_audio_for_sentence(speaker, line_text, i, output_dir):
    """
    Generate the audio file for a single sentence and speaker.
    """
    output_file = os.path.join(output_dir, f"{i:03d}_{speaker}.wav")
    temp_file = os.path.join(output_dir, f"temp_{i}.wav")

    try:
        print(f"Generating audio for {speaker}: {line_text}")

        # Call the appropriate TTS function
        if speaker.lower() == "student":
            student(line_text)
            generated_file = "student_file.wav"
        elif speaker.lower() == "teacher":
            teacher(line_text)
            generated_file = "teacher_file.wav"
        else:
            print(f"Warning: Unrecognized speaker '{speaker}'")
            return None

        # Check if the generated file exists
        retries = 5
        for _ in range(retries):
            if os.path.exists(generated_file):
                shutil.move(generated_file, temp_file)
                os.rename(temp_file, output_file)
                print(f"Generated and renamed: {output_file}")
                return output_file
            else:
                time.sleep(0.5)  # Wait briefly for the file to appear

        print(f"Error: File '{generated_file}' not found after retries for {speaker}.")
    except Exception as e:
        print(f"Error generating audio for {speaker}: {e}")
    return None

def generate_audio_from_text(text, output_path="final_conversation_withAPI.wav"):
    """
    Generates audio from text by calling the respective speaker functions (student/teacher).
    """
    conversation = text_to_conversation_with_tags(text)
    if not conversation:
        print("Error: No valid conversation found in the text.")
        return

    output_dir = os.path.join("tts_sub", "conversation_audio")
    os.makedirs(output_dir, exist_ok=True)

    metadata = []  # To store speaker, text, and file info
    failed_lines = []  # To log failed lines

    def retry_failed_lines(failed_lines, output_dir):
        """
        Retry generating audio for failed lines.
        """
        retries_metadata = []
        for speaker, line_text, i in failed_lines:
            print(f"Retrying failed line {i}: {speaker}: {line_text}")
            result = generate_audio_for_sentence(speaker, line_text, i, output_dir)
            if result:
                retries_metadata.append({
                    "file": result,
                    "speaker": speaker,
                    "text": line_text,
                    "index": i
                })
            else:
                print(f"Retry failed again for line {i}: {speaker}: {line_text}")
        return retries_metadata

    # Create a thread pool executor for parallel processing
    with ThreadPoolExecutor() as executor:
        futures = {
            executor.submit(generate_audio_for_sentence, speaker, line_text, i, output_dir): (speaker, line_text, i)
            for i, (speaker, line_text) in enumerate(conversation)
        }

        for future in futures:
            speaker, line_text, i = futures[future]
            try:
                result = future.result()
                if result:
                    metadata.append({
                        "file": result,
                        "speaker": speaker,
                        "text": line_text,
                        "index": i
                    })
                else:
                    print(f"Failed to generate audio for line {i}: {speaker}: {line_text}")
                    failed_lines.append((speaker, line_text, i))
            except Exception as e:
                print(f"Error processing a future for line {i}: {e}")
                failed_lines.append((speaker, line_text, i))

    # Retry for failed lines
    if failed_lines:
        retry_metadata = retry_failed_lines(failed_lines, output_dir)
        metadata.extend(retry_metadata)

    # Ensure metadata is sorted by index
    metadata.sort(key=lambda x: x["index"])

    # Concatenate audio files in order
    conversation_audio = AudioSegment.empty()
    for meta in metadata:
        try:
            conversation_audio += AudioSegment.from_file(meta["file"])
        except Exception as e:
            print(f"Error adding file {meta['file']} to conversation: {e}")

    # Export the final conversation audio
    try:
        conversation_audio.export(output_path, format="wav")
        print(f"Final conversation audio saved as: {output_path}")
    except Exception as e:
        print(f"Error exporting final audio: {e}")

    if failed_lines:
        print("The following lines failed even after retries:")
        for speaker, line_text, i in failed_lines:
            print(f"Line {i}: {speaker}: {line_text}")

    # Cleanup temporary files
    cleanup_generated_files(metadata, output_dir)

    return metadata


def cleanup_generated_files(metadata, output_dir):
    """
    Deletes temporary files and cleans up the directory.
    """
    try:
        for meta in metadata:
            if os.path.exists(meta["file"]):
                os.remove(meta["file"])
        if os.path.exists(output_dir):
            os.rmdir(output_dir)
        print(f"Cleaned up directory: {output_dir}")
    except Exception as e:
        print(f"Error during cleanup: {e}")
