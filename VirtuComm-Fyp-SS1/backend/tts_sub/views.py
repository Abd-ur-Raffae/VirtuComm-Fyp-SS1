from rest_framework.response import Response
from rest_framework.decorators import api_view
from tts_sub.apps import resources  # Import preloaded resources
from tts_sub.audio_to_json import audio_to_json  # Import transcription function
from .text_to_audio import generate_audio_from_text  # Import audio generation pipeline
from pydub import AudioSegment
import os
import time

@api_view(['POST'])
def text_to_audio(request):
    if request.method == 'POST':
        try:
            # Extract text input from the request
            text = request.data.get("text", "")
            if not text:
                return Response({"error": "No text provided"}, status=400)

            # Check if input text is a topic or preformatted dialogue
            if "[" not in text or "]" not in text:
                convo_client = resources.get_convo_client()
                result = convo_client.predict(
                    message=text,
                    system_message="""You are a chatbot which only replies shortly, you give different results every time and in the form of a dialogue 
                    between two characters talking about the given topic in just 10  to 15  lines. When starting
                    each person's dialogue, only start it with: '[student]' or '[teacher]' if you have to mention the names again, don't use brackets, 
                    brackets only come when starting the sentence.""",
                    max_tokens=512,
                    temperature=0.7,
                    top_p=0.95,
                    api_name="/chat"
                )
                text = result.strip()
                print(f"Generated dialogue: {text}")

            # Generate audio and metadata
            output_audio_path = "media/final_conversation.wav"
            metadata = generate_audio_from_text(text, output_path=output_audio_path)

            # Verify the audio file exists
            if not os.path.exists(output_audio_path):
                raise FileNotFoundError(f"Audio file not found: {output_audio_path}")

            # Ensure audio format compatibility
            audio = AudioSegment.from_file(output_audio_path)
            audio.export(output_audio_path, format="wav", parameters=["-ar", "22050"])

            # Transcribe audio and generate JSON
            transcription_path = "media/output_transcription.json"
            audio_to_json(output_audio_path, metadata, resources.get_whisper_model(), transcription_path)

            return Response({
                "message": "Pipeline executed successfully",
                "audio_path": output_audio_path,
                "transcription_path": transcription_path,
            })
        except FileNotFoundError as fnfe:
            print(f"File error: {fnfe}")
            return Response({"error": str(fnfe)}, status=500)
        except Exception as e:
            print(f"Error in pipeline: {e}")
            return Response({"error": str(e)}, status=500)
