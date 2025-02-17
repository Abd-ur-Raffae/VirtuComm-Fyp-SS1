from tts_sub.apps import resources
import shutil
import os
from pydub import AudioSegment


def process_audio_file(mp3_path: str, wav_path: str):
    mp3_dest_path = os.path.join(os.getcwd(), os.path.basename(mp3_path))
    shutil.move(mp3_path, mp3_dest_path)

    audio = AudioSegment.from_mp3(mp3_dest_path)
    audio.export(wav_path, format="wav")
    os.remove(mp3_dest_path)


def student(text: str):
    tts_client = resources.get_tts_client()
    voice = "en-US-RogerNeural - en-US (Male)"
    rate = 12
    pitch = 17

    result = tts_client.predict(
        text=text, voice=voice, rate=rate, pitch=pitch, api_name="/predict"
    )
    audio_path = result[0]
    process_audio_file(audio_path, "student_file.wav")


def teacher(text: str):
    tts_client = resources.get_tts_client()
    voice = "en-US-EmmaNeural - en-US (Female)"
    rate = -11
    pitch = 0

    result = tts_client.predict(
        text=text, voice=voice, rate=rate, pitch=pitch, api_name="/predict"
    )
    audio_path = result[0]
    process_audio_file(audio_path, "teacher_file.wav")
