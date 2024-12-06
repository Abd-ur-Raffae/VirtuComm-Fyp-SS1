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
                # Use the preloaded convo_client to generate dialogue from a topic
                convo_client = resources.get_convo_client()
                result = convo_client.predict(
                    message=text,
                    system_message="""You are a chatbot which only replies shortly, you give different results every time and in the form of a dialogue 
                    between two characters talking about the given topic in just 10 lines. When starting
                    each person's dialogue, only start it with: '[student]' or '[teacher]' if you have to mention the names again, don't use brackets, 
                    brackets only come when starting the sentence.
                    """,
                    max_tokens=512,
                    temperature=0.7,
                    top_p=0.95,
                    api_name="/chat"
                )
                text = result.strip()
                print(f"Generated dialogue: {text}")

            # Step 2: Generate audio and metadata
            output_audio_path = "tts_sub/final_conversation.wav"
            metadata = generate_audio_from_text(text, output_path=output_audio_path)

            # Verify the audio file exists
            if not os.path.exists(output_audio_path):
                raise FileNotFoundError(f"Audio file not found: {output_audio_path}")
            
            # Step 3: Ensure audio format compatibility
            print("Converting audio to standard .wav format...")
            audio = AudioSegment.from_file(output_audio_path)
            audio.export(output_audio_path, format="wav", parameters=["-ar", "22050"])

            # Step 4: Wait to ensure file availability
             # Allow time for the file system to stabilize

            # Step 5: Transcribe audio and generate JSON
            transcription_path = "tts_sub/output_transcription.json"
            audio_to_json(output_audio_path, metadata, resources.get_whisper_model(), transcription_path)

            return Response({
                "message": "Pipeline executed successfully",
                "audio_path": output_audio_path,
                "transcription_path": transcription_path,
                "metadata": metadata
            })
        except FileNotFoundError as fnfe:
            print(f"File error: {fnfe}")
            return Response({"error": str(fnfe)}, status=500)
        except Exception as e:
            print(f"Error in pipeline: {e}")
            return Response({"error": str(e)}, status=500)
