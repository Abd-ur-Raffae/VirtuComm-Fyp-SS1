import numpy as np
import onnxruntime
import soundfile as sf
import yaml
import os
import re
from ttstokenizer import TTSTokenizer
from pydub import AudioSegment
from .audio_to_subtitle import audio_to_json
from rest_framework.response import Response
from rest_framework.decorators import api_view


def text_to_conversation_with_tags(text):
    pattern = r"\[([^\]]+)\]\s*(.*)"
    matches = re.findall(pattern, text)
    return [(speaker.strip(), sentence.strip()) for speaker, sentence in matches]

# Create your views here.
@api_view(['POST'])
def text_to_audio(request):
    if request.method == 'POST':
        try:
            text = request.data
            print(text)
            print('ghar aa gaye hen')
            # Load configuration
            with open("vctk-vits-onnx/config.yaml", "r", encoding="utf-8") as f:
                config = yaml.safe_load(f)

            # Create model
            try:
                model = onnxruntime.InferenceSession(
                    "vctk-vits-onnx/model.onnx",
                    providers=["CPUExecutionProvider"]
                )
            except:
                print('ghar unjao')

            # Create tokenizer
            tokenizer = TTSTokenizer(config["token"]["list"])

            # Define speaker IDs for Person 1 and Person 2
            person_1_sid = 9  # Speaker ID for Person 1
            person_2_sid = 92  # Speaker ID for Person 2

            # Example conversation
           
            # text = """
            # [Person 1] Hello mr, how are you?
            # [Person 2] I am doing great, thanks, And you?
            # [Person 1] just hanging around.
            # """

            conversation = text_to_conversation_with_tags(text)

            # Directory to save individual audio lines
            output_dir = "conversation_audio1"
            os.makedirs(output_dir, exist_ok=True)

            # Generate speech for each line
            for i, (speaker, line_text) in enumerate(conversation):
                sid = person_1_sid if speaker == "Person 1" else person_2_sid
                inputs = tokenizer(line_text)
                outputs = model.run(None, {"text": inputs, "sids": np.array([sid])})
                output_file = os.path.join(output_dir, f"line_{i}.wav")
                sf.write(output_file, outputs[0], 22050)
                print(f"Generated: {output_file}")

            # Concatenate the audio files into a full conversation
            conversation_audio = AudioSegment.empty()
            audio_files = sorted([os.path.join(output_dir, f) for f in os.listdir(output_dir) if f.endswith(".wav")])

            for file in audio_files:
                conversation_audio += AudioSegment.from_file(file)

            final_audio_path = "final_conversation1.wav"
            conversation_audio.export(final_audio_path, format="wav")
            print(f"Final conversation audio saved as: {final_audio_path}")

            # Check if final conversation audio is created and delete directory
            if os.path.exists(final_audio_path):
                print("Final conversation audio created successfully.")
                for file in audio_files:
                    os.remove(file)  # Delete individual audio files
                os.rmdir(output_dir)  # Remove directory
                print(f"Deleted directory: {output_dir}")


            # Transcribe audio to JSON
            audio_to_json(final_audio_path)
        except:
            return Response("Ghar not found")
