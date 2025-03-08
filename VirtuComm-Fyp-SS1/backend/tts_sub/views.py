from rest_framework.response import Response
from rest_framework.decorators import api_view
from tts_sub.apps import resources  # Import preloaded resources
from .text_to_audio import process_conversation_pipeline # Import audio generation pipeline
from pydub import AudioSegment
from .text_to_audio_single import generate_audio_from_plain_text
from .audio_to_json_single import audio_to_sub_single
from .utilities import generate_lipsync_for_patch,generate_text,recheck_for_errors,get_recommended_links,get_interviewer_applicant_dialogue
from concurrent.futures import ThreadPoolExecutor
import os,json



@api_view(['POST']) 
def text_to_audio(request):
    try:
        text = request.data.get("text", "")
        if not text:
            return Response({"error": "No text provided"}, status=400)

        # Generate dialogue if the input is a topic.
        with ThreadPoolExecutor(max_workers=2) as executer:
                dialogue = executer.submit(generate_text,text)
                links =executer.submit(get_recommended_links, text)

                result_text = dialogue.result()
                recommended_links  =links.result()


        # print(f"recommended links are: {recommended_links}")
        print(f"Generated dialogue: {result_text}")

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_folder = os.path.join(BASE_DIR, "../backend/media")
        output_folder = os.path.abspath(output_folder)
        

        # Process the pipeline for each conversation line concurrently.
        pipeline_results = process_conversation_pipeline(result_text, output_folder, max_workers=4)

        # Optionally, save metadata for reference.
        file_name = "media/metaDataPatches.json"
        final_data = {
            "prompt": text,
            "pipeline_results": pipeline_results
        }
        with open(file_name, "w", encoding="utf-8") as json_file:
            json.dump(final_data, json_file, ensure_ascii=False, indent=4)

        final_result = recheck_for_errors(pipeline_results,output_folder)
        return Response({
            "message": "Pipeline executed successfully",
            "pipeline_results": final_result,
            "metadata_path": file_name,
            "recommendation_links":recommended_links
        }, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
        

@api_view(['POST'])
def interview(request):
    try:
        text = request.data.get("text", "")
        if not text:
            return Response({"error": "No text provided"}, status=400)

        # Generate dialogue if the input is a topic.
        with ThreadPoolExecutor(max_workers=2) as executer:
                dialogue = executer.submit(get_interviewer_applicant_dialogue,text)
                links =executer.submit(get_recommended_links, text)

                result_text = dialogue.result()
                recommended_links  =links.result()


        # print(f"recommended links are: {recommended_links}")
        print(f"Generated dialogue: {result_text}")

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_folder = os.path.join(BASE_DIR, "../backend/media/interview")
        output_folder = os.path.abspath(output_folder)
        

        # Process the pipeline for each conversation line concurrently.
        pipeline_results = process_conversation_pipeline(result_text, output_folder, max_workers=4)

        # Optionally, save metadata for reference.
        file_name = "media/metaDataPatches.json"
        final_data = {
            "recommendation_links":recommended_links,
            "prompt": text,
            "pipeline_results": pipeline_results
        }
        with open(file_name, "w", encoding="utf-8") as json_file:
            json.dump(final_data, json_file, ensure_ascii=False, indent=4)

        final_result = recheck_for_errors(pipeline_results,output_folder)
        return Response({
            "message": "Pipeline executed successfully",
            "pipeline_results": final_result,
            "metadata_path": file_name,
        }, status=201)
    except Exception as e:
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
            transcription_path = "media/final_single.json"
            with ThreadPoolExecutor(max_workers=2) as executer:
                executer.submit(generate_lipsync_for_patch,output_audio_path)
                executer.submit(audio_to_sub_single, output_audio_path)

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
        
