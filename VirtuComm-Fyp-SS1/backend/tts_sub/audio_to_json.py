# audio_to_json.py

import os
import json
import glob
import requests
from concurrent.futures import ThreadPoolExecutor

# ─── CONFIG ──────────────────────────────────────────────────────────────────
# Change this to your actual endpoint (or set via ENV var)
WHISPER_API_URL = "https://jawwad1234-fast-api-whisper.hf.space/subtitles"

# ─── SINGLE‑FILE TRANSCIBE ────────────────────────────────────────────────────
def transcribe_audio_api(audio_path: str) -> dict:
    """
    Send one WAV file to /subtitles and write out {base}_sub.json.
    Returns the subtitle dict for this file.
    """
    with open(audio_path, "rb") as f:
        files = [
            ("files", (os.path.basename(audio_path), f, "audio/wav"))
        ]
        resp = requests.post(WHISPER_API_URL, files=files)
        resp.raise_for_status()

    # Response JSON has shape {"files":[{filename, segments},...]}
    entry = resp.json()["files"][0]

    # Write out alongside the WAV
    json_path = os.path.splitext(audio_path)[0] + "_sub.json"
    with open(json_path, "w", encoding="utf-8") as jf:
        json.dump(entry, jf, ensure_ascii=False, indent=2)

    return entry

# ─── BATCH ALL AT ONCE ────────────────────────────────────────────────────────
def transcribe_audios_in_folder_batch(folder: str) -> list[dict]:
    """
    Finds all .wav files in `folder`, sends them in ONE request to /subtitles,
    writes out a _sub.json per file, and returns the list of subtitle entries.
    """
    wav_paths = glob.glob(os.path.join(folder, "*.wav"))
    if not wav_paths:
        return []

    # Build multipart payload
    files = []
    for p in wav_paths:
        files.append(
            ("files", (os.path.basename(p), open(p, "rb"), "audio/wav"))
        )

    resp = requests.post(WHISPER_API_URL, files=files)
    resp.raise_for_status()
    entries = resp.json()["files"]

    # Write out each JSON
    for entry in entries:
        wav_name = entry["filename"]
        wav_full = os.path.join(folder, wav_name)
        json_path = os.path.splitext(wav_full)[0] + "_sub.json"
        with open(json_path, "w", encoding="utf-8") as jf:
            json.dump(entry, jf, ensure_ascii=False, indent=2)

    return entries

# ─── PER‑FILE PARALLEL ────────────────────────────────────────────────────────
def transcribe_audios_in_folder_parallel(folder: str, max_workers: int = None) -> list[dict]:
    """
    Finds all .wav files in `folder` and runs transcribe_audio_api() on each
    in a ThreadPoolExecutor for parallel HTTP requests.
    """
    wav_paths = glob.glob(os.path.join(folder, "*.wav"))
    if not wav_paths:
        return []

    if max_workers is None:
        max_workers = os.cpu_count() or 4

    with ThreadPoolExecutor(max_workers=max_workers) as exe:
        results = list(exe.map(transcribe_audio_api, wav_paths))

    return results
