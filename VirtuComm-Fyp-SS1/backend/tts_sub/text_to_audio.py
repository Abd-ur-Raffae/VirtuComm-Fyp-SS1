import os
from concurrent.futures import ThreadPoolExecutor
from .voiceGen import student, teacher  # Import your TTS functions
from pydub import AudioSegment
import re
import shutil


def text_to_conversation_with_tags(text):
    """
    Converts a text with explicit speaker tags into a conversation dictionary.
    Args:
        text (str): Input text with speaker tags (e.g., [Person 1], [Person 2]).
    Returns:
        list: A conversation list with speakers and their respective sentences.
    """
    pattern = r"\[([^\]]+)\]\s*(.*)"
    matches = re.findall(pattern, text)
    conversation = [(speaker.strip(), sentence.strip()) for speaker, sentence in matches]
    return conversation

def generate_audio_for_sentence(speaker, line_text, i, output_dir):
    """
    Generate the audio file for a single sentence and speaker.
    Args:
        speaker (str): The speaker tag (e.g., 'student', 'teacher').
        line_text (str): The text to generate audio for.
        i (int): The index of the sentence.
        output_dir (str): Directory where audio files are saved.
    Returns:
        str: Path to the generated audio file, or None if an error occurs.
    """
    output_file = os.path.join(output_dir, f"{i:03d}_{speaker}.wav")
    print(f"Generating audio for {speaker}: {line_text}")

    try:
        temp_file = f"temp_{i}.wav"
        if speaker.lower() == "student":
            student(line_text)
            generated_file = "student_file.wav"
        elif speaker.lower() == "teacher":
            teacher(line_text)
            generated_file = "teacher_file.wav"
        else:
            print(f"Warning: Unrecognized speaker '{speaker}'")
            return None

        # Rename the generated file to avoid conflicts
        if os.path.exists(generated_file):
            shutil.move(generated_file, temp_file)
            os.rename(temp_file, output_file)
            print(f"Generated and renamed: {output_file}")
        else:
            print(f"Error: '{generated_file}' not found!")
            return None
    except Exception as e:
        print(f"Error generating audio for {speaker}: {e}")
        return None

    return output_file

def generate_audio_from_text(text, output_path="final_conversation_withAPI.wav"):
    """
    Generates audio from text by calling the respective speaker functions (student/teacher).
    Args:
        text (str): Dialogue text with speaker tags.
        output_path (str): Path for the final concatenated audio file.
    Returns:
        list: Metadata about the generated audio files.
    """
    conversation = text_to_conversation_with_tags(text)
    if not conversation:
        print("Error: No valid conversation found in the text.")
        return

    output_dir = "tts_sub/conversation_audio"
    os.makedirs(output_dir, exist_ok=True)

    metadata = []  # To store speaker, text, and file info

    # Create a thread pool executor for parallel processing
    with ThreadPoolExecutor() as executor:
        futures = {
            executor.submit(generate_audio_for_sentence, speaker, line_text, i, output_dir): (speaker, line_text, i)
            for i, (speaker, line_text) in enumerate(conversation)
        }

        for future in futures:
            try:
                result = future.result()
                if result:
                    speaker, line_text, i = futures[future]
                    metadata.append({
                        "file": result,
                        "speaker": speaker,
                        "text": line_text,
                        "index": i
                    })
            except Exception as e:
                print(f"Error processing a future: {e}")

    # Ensure metadata is sorted by index
    metadata.sort(key=lambda x: x["index"])

    # Concatenate audio files in order
    conversation_audio = AudioSegment.empty()
    for meta in metadata:
        conversation_audio += AudioSegment.from_file(meta["file"])

    # Export the final conversation audio
    conversation_audio.export(output_path, format="wav")
    print(f"Final conversation audio saved as: {output_path}")

    # Cleanup
    for meta in metadata:
        os.remove(meta["file"])
    os.rmdir(output_dir)
    print(f"Deleted directory: {output_dir}")

    return metadata

