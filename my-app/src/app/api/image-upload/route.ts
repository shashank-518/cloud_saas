import {v2 as cloudinary} from 'cloudinary'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


interface cloudinaryUploadResponse {
    public_id : string;
    [key: string] : any     
}


export async function POST(req :NextRequest){
    const {userId} = await auth()

    if(!userId){
        return new Response('Unauthorized', {status: 401})
    }

    try {
        
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if(!file){
            return new Response('No file provided', {status: 400})
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<cloudinaryUploadResponse>((resolve , reject)=>{
           const upload_stream =  cloudinary.uploader.upload_stream({folder : "next-cloudinary-uploads"} , (error ,result)=>{
                if(error){
                    reject(error)
                }
                else {
                    resolve(result as cloudinaryUploadResponse)
                }
            })

            upload_stream.end(buffer)

        })

        return NextResponse.json(
            {
                public_id : result.public_id
            },
            {
                status: 200
            }
        )


    } catch (error) {

        console.log("Failed in uploading image to cloudinary", error);
        return new Response("Failed to upload image to cloudinary", {status: 500})
        
        
    }


}
