import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const config = {
  api: {
    bodyParser: false, 
  },
};

interface cloudinaryUploadResponse {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("hello");
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<cloudinaryUploadResponse>(
      (resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { 
            resource_type : "video",
            folder: "videos-upload" ,
            transformation:[
                {
                    quality : "auto",
                    fetch_format : "mp4"
                }
            ]



           },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as cloudinaryUploadResponse);
            }
          }
        );

        upload_stream.end(buffer);
      }
    );

    const videos = await prisma.videos.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.log("Failed in uploading video to cloudinary", error);
    return new Response("Failed to upload video to cloudinary", {
      status: 500,
    });
  } finally {
    prisma.$disconnect();
  }
}
