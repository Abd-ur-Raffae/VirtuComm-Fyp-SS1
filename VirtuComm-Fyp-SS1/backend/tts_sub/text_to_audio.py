# text_to_audio.py

import os
import shutil
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

from .voiceGen import student, teacher, applicant, interviewr, guest, host
from .audio_to_json import transcribe_audio_api, transcribe_audios_in_folder_parallel
from .utilities import generate_lipsync_for_patch

def text_to_conversation_with_tags(text: str):
    pattern = r"\[([^\]]+)\]\s*(.*)"
    return [(sp.strip(), ln.strip()) for sp, ln in re.findall(pattern, text)]

def generate_audio_for_sentence(speaker: str, line: str, idx: int, out_dir: str):
    wav_name  = f"{idx:03d}_{speaker}.wav"
    wav_path  = os.path.join(out_dir, wav_name)
    tmp_name  = f"{idx:03d}_{speaker}_tmp.wav"
    tmp_path  = os.path.join(out_dir, tmp_name)

    print(f"Generating audio for {speaker}: {line}")
    # dispatch to your FastAPI‑backed TTS under the covers:
    if   speaker.lower() == "student":    student(line)
    elif speaker.lower() == "teacher":    teacher(line)
    elif speaker.lower() == "applicant":  applicant(line)
    elif speaker.lower() == "interviewer": interviewr(line)
    elif speaker.lower() == "guest":      guest(line)
    elif speaker.lower() == "host":       host(line)
    else:
        print(f"Unknown speaker {speaker}")
        return None

    # wait & rename
    gen_file = f"{speaker.lower()}_file.wav"
    for _ in range(5):
        if os.path.exists(gen_file):
            shutil.move(gen_file, tmp_path)
            os.rename(tmp_path, wav_path)
            print(f"→ {wav_path}")
            return wav_path

    print(f"Failed to find {gen_file}")
    return None
def process_conversation_pipeline(text: str, output_dir: str, post_workers: int = None):
    # A) Parse
    conv = text_to_conversation_with_tags(text)
    if not conv:
        return []

    # Prepare folder
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    # B) Stage 1: Generate all audios
    all_audio_paths = {}
    with ThreadPoolExecutor(max_workers=len(conv)) as exec_gen:
        gen_futs = {
            exec_gen.submit(generate_audio_for_sentence, sp, ln, i, output_dir): i
            for i, (sp, ln) in enumerate(conv)
        }

        for fut in as_completed(gen_futs):
            i = gen_futs[fut]
            try:
                result = fut.result()
                if result:
                    all_audio_paths[i] = result
            except Exception as e:
                print(f"[ERROR] Audio gen failed for index {i}: {e}")

    # C) Transcription (parallel on valid files)
    if post_workers is None:
        post_workers = len(all_audio_paths)/2

    trans_map = {}
    lipsync_map = {}

    valid_audio_files = list(all_audio_paths.values())

    # C.1 Transcription
    try:
        transcription_entries = transcribe_audios_in_folder_parallel(output_dir, max_workers=post_workers)
        trans_map = {
            os.path.join(output_dir, entry["filename"]): entry
            for entry in transcription_entries
        }
    except Exception as e:
        print(f"[ERROR] Transcription stage failed: {e}")

    # C.2 Lipsync
    with ThreadPoolExecutor(max_workers=post_workers) as exec_lip:
        lip_futs = {
            exec_lip.submit(generate_lipsync_for_patch, wav): wav
            for wav in valid_audio_files
        }
        for fut in as_completed(lip_futs):
            wav = lip_futs[fut]
            try:
                lipsync_map[wav] = fut.result()
            except Exception as e:
                print(f"[ERROR] Lipsync failed for {wav}: {e}")

    # D) Assemble all results, including missing audio
    results = []
    for i, (sp, ln) in enumerate(conv):
        wav = os.path.join(output_dir, f"{i:03d}_{sp}.wav")
        results.append({
            "speaker": sp,
            "text": ln,
            "index": i,
            "audio_file": wav,
            "transcription": trans_map.get(wav),
            "lipsync": lipsync_map.get(wav)
        })

    return results
