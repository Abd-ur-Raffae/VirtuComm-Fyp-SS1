from rest_framework.response import Response
from rest_framework.decorators import api_view
from tts_sub.apps import ONNX_MODEL, CONFIG  # Import the globals
import numpy as np
from ttstokenizer import TTSTokenizer
import os
import re
import soundfile as sf
from pydub import AudioSegment
from .audio_to_subtitle import audio_to_json

@api_view(['POST'])
def text_to_audio(request):
    if request.method == 'POST':
        try:
            # Extract text from the request
            text = request.data.get("text", "")
          #
            if not text:
                return Response({"error": "No text provided"}, status=400)

            # Create tokenizer using the loaded CONFIG
            tokenizer = TTSTokenizer(CONFIG["token"]["list"])

            # Define speaker IDs
            person_1_sid = 9  # Speaker ID for Person 1
            person_2_sid = 92  # Speaker ID for Person 2

            # Parse conversation text
            def text_to_conversation_with_tags(text):
                # Ensure input is split into manageable chunks based on speaker tags
                split_text = re.split(r'(\[[^\]]+\])', text)
                
                conversation = []
                current_speaker = None
                
                for chunk in split_text:
                    if chunk.startswith("[") and chunk.endswith("]"):
                        current_speaker = chunk.strip("[]").lower()
                    elif current_speaker and chunk.strip():
                        conversation.append((current_speaker, chunk.strip()))
                
                return conversation


            conversation = text_to_conversation_with_tags(text)

            # Directory to save individual audio lines
            output_dir = "tts_sub/conversation_audio1"
            os.makedirs(output_dir, exist_ok=True)

            # Generate speech for each line
            for i, (speaker, line_text) in enumerate(conversation):
                try:
                    if speaker == "person 1":
                        sid = person_1_sid
                    elif speaker == "person 2":
                        sid = person_2_sid
                    else:
                        raise ValueError(f"Unknown speaker tag: {speaker}")
                    inputs = tokenizer(line_text)
                    #print(f"Tokenizer output for line {i}: {inputs}")

                    outputs = ONNX_MODEL.run(None, {"text": inputs, "sids": np.array([sid])})
                    #print(f"Model output for line {i}: {outputs}")

                    if not outputs or len(outputs[0]) == 0:
                        raise ValueError(f"No audio generated for line {i}")
                    
                    output_file = os.path.join(output_dir, f"line_{i}.wav")
                    sf.write(output_file, outputs[0], 22050)
                    print(f"Generated: {output_file}")
                except Exception as e:
                    print(f"Error generating audio for line {i}: {e}")

            # Concatenate the audio files into a full conversation
            conversation_audio = AudioSegment.empty()
            audio_files = sorted([os.path.join(output_dir, f) for f in os.listdir(output_dir) if f.endswith(".wav")])

            for file in audio_files:
                conversation_audio += AudioSegment.from_file(file)

            final_audio_path = "tts_sub/final_conversation1.wav"
            conversation_audio.export(final_audio_path, format="wav", parameters=["-ar", "22050"])
            print(f"Final conversation audio saved as: {final_audio_path}")

            # Check if final conversation audio is created and clean up
            if os.path.exists(final_audio_path):
                print("Final conversation audio created successfully.")
                for file in audio_files:
                    os.remove(file)
                os.rmdir(output_dir)

            audio_to_json(final_audio_path)
            return Response({"message": "Audio generated successfully", "audio_path": final_audio_path})
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=500)
