import os
import tempfile
import requests
from .apps import resources
import shutil
from pydub import AudioSegment


# Try to read the hosted URL from an env var, otherwise hard‑code your FastAPI endpoint
TTS_API_URL = resources.get_edge_tts_api_url()

def _call_tts(text: str, voice_label: str, rate: int, pitch: int) -> str:
    """
    Sends text to the TTS API, saves the returned MP3 to a temp file,
    and returns the temp file path.
    """
    payload = {
        "text": text,
        "voice": voice_label,
        "rate": rate,
        "pitch": pitch
    }
    resp = requests.post(TTS_API_URL, json=payload)
    resp.raise_for_status()
    # write the binary MP3 to a temp file
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tmp.write(resp.content)
    tmp.close()
    return tmp.name

def student(text: str):
    voice = "en-US-RogerNeural - en-US (Male)"
    rate = 12
    pitch = 17
    mp3_path = _call_tts(text, voice, rate, pitch)
    process_audio_file(mp3_path, "student_file.wav")

def teacher(text: str):
    voice = "en-US-EmmaNeural - en-US (Female)"
    rate = -11
    pitch = 0
    mp3_path = _call_tts(text, voice, rate, pitch)
    process_audio_file(mp3_path, "teacher_file.wav")

def interviewr(text: str):
    voice = "en-US-AndrewNeural - en-US (Male)"
    rate = 0
    pitch = 0
    mp3_path = _call_tts(text, voice, rate, pitch)
    process_audio_file(mp3_path, "interviewer_file.wav")

def applicant(text: str):
    voice = "en-US-BrianMultilingualNeural - en-US (Male)"
    rate = 0
    pitch = 9
    mp3_path = _call_tts(text, voice, rate, pitch)
    process_audio_file(mp3_path, "applicant_file.wav")

def guest(text: str):
    voice = "en-US-BrianNeural - en-US (Male)"
    rate = 0
    pitch = 0
    mp3_path = _call_tts(text, voice, rate, pitch)
    process_audio_file(mp3_path, "guest_file.wav")

def host(text: str):
    voice = "en-US-ChristopherNeural - en-US (Male)"
    rate = 0
    pitch = 0
    mp3_path = _call_tts(text, voice, rate, pitch)
    process_audio_file(mp3_path, "host_file.wav")


def process_audio_file(mp3_path: str, wav_path: str):
    mp3_dest_path = os.path.join(os.getcwd(), os.path.basename(mp3_path))
    shutil.move(mp3_path, mp3_dest_path)

    audio = AudioSegment.from_mp3(mp3_dest_path)
    audio.export(wav_path, format="wav")
    os.remove(mp3_dest_path)
