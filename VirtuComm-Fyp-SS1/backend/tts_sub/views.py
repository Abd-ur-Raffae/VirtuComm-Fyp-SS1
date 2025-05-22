from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from tts_sub.apps import resources  # Import preloaded resources
from .text_to_audio import process_conversation_pipeline # Import audio generation pipeline
from pydub import AudioSegment
from .utilities import generate_lipsync_for_single,recheck_for_errors,get_recommended_links, gen_dialogue
from concurrent.futures import ThreadPoolExecutor
import os,json, time



@api_view(['POST'])
def text_to_audio(request):
    try:
        text = request.data.get("text", "")

        if not text:
            return Response({"error": "No text provided"}, status=400)


        with ThreadPoolExecutor(max_workers=2) as executer:
                dialogue = executer.submit(gen_dialogue,text, "stu_teach")
                links =executer.submit(get_recommended_links, text)

                result_text = dialogue.result()
                recommended_links  =links.result()
        print(f"Generated dialogue: {result_text}")

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_folder = os.path.join(BASE_DIR, "../backend/media/stu_teach")
        output_folder = os.path.abspath(output_folder)
        
        max_cores = os.cpu_count()
        pipeline_results = process_conversation_pipeline(result_text, output_folder, max_cores)

        file_name = os.path.join(output_folder, "metaDataPatches.json")
        final_data = {
            "prompt": text,
            "pipeline_results": pipeline_results,
            "recommendation_links": recommended_links,
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
def interview(request):
    try:
        text = request.data.get("text", "")
        if not text:
            return Response({"error": "No text provided"}, status=400)
 
        
        with ThreadPoolExecutor(max_workers=2) as executer:
            dialogue = executer.submit(gen_dialogue, text, "interview")
            links = executer.submit(get_recommended_links, text)

            result_text = dialogue.result()
            recommended_links = links.result()

        print(f"Generated dialogue: {result_text}")
        
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_folder = os.path.join(BASE_DIR, "../backend/media/interview")
        output_folder = os.path.abspath(output_folder)


        max_cores = os.cpu_count()
        pipeline_results = process_conversation_pipeline(result_text, output_folder)

        file_name = os.path.join(output_folder, "metaDataPatches.json")

        final_data = {
            "recommendation_links": recommended_links,
            "prompt": text,
            "pipeline_results": pipeline_results,
        }
        with open(file_name, "w", encoding="utf-8") as json_file:
            json.dump(final_data, json_file, ensure_ascii=False, indent=4)

        final_result = recheck_for_errors(pipeline_results, output_folder)
        return Response({
            "message": "Pipeline executed successfully",
            "pipeline_results": final_result,
            "metadata_path": file_name,
        }, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def podcast(request):
    start_time = time.time()
    try:
        text = request.data.get("text", "")

        if not text:
            return Response({"error": "No text provided"}, status=400) 

        
        with ThreadPoolExecutor(max_workers=2) as executer:
            dialogue = executer.submit(gen_dialogue, text, "podcast")
            links = executer.submit(get_recommended_links, text)

            result_text = dialogue.result()
            recommended_links = links.result()

        print(f"Generated dialogue: {result_text}")
        
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_folder = os.path.join(BASE_DIR, "../backend/media/podcast")
        output_folder = os.path.abspath(output_folder)

        max_cores = os.cpu_count()
        pipeline_results = process_conversation_pipeline(result_text, output_folder, max_cores)

        file_name = os.path.join(output_folder, "metaDataPatches.json")

        final_data = {
            "recommendation_links": recommended_links,
            "prompt": text,
            "pipeline_results": pipeline_results,
        }
        with open(file_name, "w", encoding="utf-8") as json_file:
            json.dump(final_data, json_file, ensure_ascii=False, indent=4)

        final_result = recheck_for_errors(pipeline_results, output_folder)
        end_time  =time.time()
        print(f"pipeline completed in: {end_time - start_time:.2f}")
        return Response({
            "message": "Pipeline executed successfully",
            "pipeline_results": final_result,
            "metadata_path": file_name,
        }, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

 