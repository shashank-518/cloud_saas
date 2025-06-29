"use client"

import React ,{useState} from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const VideoUpload = () => {

  const [file , setFile]= useState<File | null>(null)
  const [title , setTitle] = useState("")
  const [descrption , setDescription] = useState("")
  const [loading , setLoading] = useState<boolean>(false)
  const router = useRouter()

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (event : React.FormEvent) =>{
    event.preventDefault()

    if(!file)  return 

    if(file.size > MAX_FILE_SIZE){
      alert("File size is too large")
      return 
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("file" , file)
    formData.append("title" , title)
    formData.append("description" , descrption)
    formData.append("originalSize" , file.size.toString())

    try {
      
      await axios.post("/api/videos-upload" ,formData)

      router.push("/mainpage")
    } catch (error) {
      console.log(error);
      
    }
    finally{
      setLoading(false)
      router.push("/mainpage")
    }

}





  return (
     <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={descrption}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
  )
}

export default VideoUpload