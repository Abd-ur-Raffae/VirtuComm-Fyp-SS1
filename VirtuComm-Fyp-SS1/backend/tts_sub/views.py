from rest_framework.response import Response
from rest_framework.decorators import api_view
from tts_sub.apps import resources  # Import preloaded resources
from tts_sub.audio_to_json import audio_to_json  # Import transcription function
from .text_to_audio import generate_audio_from_text # Import audio generation pipeline
from pydub import AudioSegment
from .text_to_audio_single import generate_audio_from_plain_text
from .audio_to_json_single import audio_to_json_single
from .lipsing import generate_lipsync_json_for_final_audio
from concurrent.futures import ThreadPoolExecutor
import os,json


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
                result = result.strip()
                print(f"Generated dialogue: {result}")

            # Generate audio and metadata
            output_audio_path = "media/final_conversation.wav"
            metadata = generate_audio_from_text(result, output_path=output_audio_path)

            # Generate Lip Sync JSON for final audio
            

            # Verify the audio file exists
            if not os.path.exists(output_audio_path):
                raise FileNotFoundError(f"Audio file not found: {output_audio_path}")
            
            # saving metadata:
            file_name="media/metaDataDual.json"
            finalData = {
                "prompt": text,
                "data":metadata
            }
            with open(file_name,"w",encoding="utf-8") as json_file:
                json.dump(finalData,json_file,ensure_ascii=False, indent=4)
            print(f"metadata file saved as {file_name}")

            # Ensure audio format compatibility
            audio = AudioSegment.from_file(output_audio_path)
            audio.export(output_audio_path, format="wav", parameters=["-ar", "22050"])

            transcription_path = "media/output_transcription.json"
            
            #lipsing and subtitle geneartion running paralelly now:
            with ThreadPoolExecutor(max_workers=2) as executor:
                executor.submit(generate_lipsync_json_for_final_audio, output_audio_path)
                executor.submit(audio_to_json, output_audio_path, metadata, resources.get_whisper_model(), transcription_path)

            return Response({
                "message": "Pipeline executed successfully",
                "audio_path": output_audio_path,
                "transcription_path": transcription_path,
            }, status=201)
        except FileNotFoundError as fnfe:
            print(f"File error: {fnfe}")
            return Response({"error": str(fnfe)}, status=500)
        except Exception as e:
            print(f"Error in pipeline: {e}")
            return Response({"error": str(e)}, status=500)
        

@api_view(['POST'])
def single_model(request):
    if request.method == 'POST':
        try:
            # Extract text input from the request
            speaker = "Smith"
            text = request.data.get("text", "")
            if not text:
                return Response({"error": "No text provided"}, status=400)

            # Check if input text is a topic or preformatted dialogue
            if "[" not in text or "]" not in text:
                convo_client = resources.get_convo_client()
                result = convo_client.predict(
                    message=text,
                    system_message=f"""You are a friendly chatbot named {speaker} which only exlpains shortly.""",
                    max_tokens=512,
                    temperature=0.7,
                    top_p=0.95,
                    api_name="/chat"
                )
                result = result.strip()
                print(f"Generated dialogue: {result}")

            # Generate audio
            output_audio_path = "media/final_single.wav"
            generate_audio_from_plain_text(result, output_path=output_audio_path)

            # Verify the audio file exists
            if not os.path.exists(output_audio_path):
                raise FileNotFoundError(f"Audio file not found: {output_audio_path}")

            # Ensure audio format compatibility
            audio = AudioSegment.from_file(output_audio_path)
            audio.export(output_audio_path, format="wav", parameters=["-ar", "22050"])

            #creating metadata for single model
            fileName = "media/metaDataSingle.json"
            metadata = {"speaker": speaker, "prompt":text, "text":result}
            with open(fileName, "w", encoding="utf-8") as f:
                json.dump(metadata, f, ensure_ascii=False, indent=4)
            print(f"metadata file saved as {fileName}")
            
            #running lispin and subtitle geneartion parallely SHAYD
            transcription_path = "media/output_transcription_single.json"
            with ThreadPoolExecutor(max_workers=2) as executer:
                executer.submit(generate_lipsync_json_for_final_audio,output_audio_path)
                executer.submit(audio_to_json_single, output_audio_path, resources.get_whisper_model(), transcription_path)
            

            #generate_lipsync_json_for_final_audio(output_audio_path)
            # Transcribe audio and generate JSON
            
            #audio_to_json_single(output_audio_path, resources.get_whisper_model(), transcription_path)

            return Response({
                "message": "Pipeline executed successfully",
                "audio_path": output_audio_path,
                "transcription_path": transcription_path,
            }, status=201)
        except FileNotFoundError as fnfe:
            print(f"File error: {fnfe}")
            return Response({"error": str(fnfe)}, status=500)
        except Exception as e:
            print(f"Error in pipeline: {e}")
            return Response({"error": str(e)}, status=500)
        
# @api_view(['POST'])
# def query_suggestor(request):
#     if request.method == 'POST':
#         try:
#             # Extract text input from the request
#             text = request.data.get("text", "")
#             if not text:
#                 return Response({"error": "No text provided"}, status=400)

#             # Check if input text is a topic or preformatted dialogue
#             if "[" not in text or "]" not in text:
#                 convo_client = resources.get_convo_client()
#                 result = convo_client.predict(
#                     message=text,
#                     system_message=f"""Generate 3 popular and relevant questions based on the given input.
#                     Each question should be clear, concise, and fit naturally as a query someone might search for. 
#                     Response should only contain these questions. Format the response as follows:
#                     1. <First question>
#                     2. <Second question>
#                     3. <Third question>
#                     Ensure that each question is in a single line and directly related to the input.""",
#                     max_tokens=512,
#                     temperature=0.7,
#                     top_p=0.95,
#                     api_name="/chat"
#                 )
#                 result = result.strip()
#                 print(f"Generated dialogue: {result}")


#             return Response({"result":result, 
#                             "message": "Pipeline executed successfully",}
#                             , status=201)
#         except FileNotFoundError as fnfe:
#             print(f"File error: {fnfe}")
#             return Response({"error": str(fnfe)}, status=500)
#         except Exception as e:
#             print(f"Error in pipeline: {e}")
#             return Response({"error": str(e)}, status=500)
        
