"use client";

import React , {useState , useEffect , useCallback} from "react";
import axios from "axios";
import 'next-cloudinary/dist/cld-video-player.css';
import { Video } from "@/types";
import VideoCard from "@/components/VideoCard";
 

export default function Home (){

  const [videos , setVideos] = useState<Video[]>([])
  const [loading , isLoading] = useState(true)
  const [error, setError] = useState(null);

  const fetchvideos = useCallback(async ()=> {
    try {

      const response = await axios.get("/api/videos");

      if(Array.isArray(response.data)){
        setVideos(response.data)
      }
      else{
        throw new Error("Invalid response data");
      }

      
    } catch (error:any) {
      console.log(error);
      setError(error || "Failed to fetch videos");
    }
    finally{
      isLoading(false)
    }
  } ,[])


  useEffect(() => {
    fetchvideos()
  }, [fetchvideos])


   const handleDownload = useCallback((url: string , title : string)=> {
           const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${title}.mp4`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


   },[])

   if(loading){
       return (
       <>

       <div className="flex items-center justify-center h-40 w-full ">
          <span className="loading loading-spinner text-yellow-500 scale-150"></span>
      </div>

       
       </>

       )
    }

  return (
   <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {videos.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No videos available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onDownload={handleDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
  )
}


