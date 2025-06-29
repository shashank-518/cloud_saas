import { NextResponse} from "next/server";
import { PrismaClient } from "../../../generated/prisma/client"


const prisma = new PrismaClient();

export async function GET(){
    try {

        const data = await prisma.videos.findMany({
            orderBy : {
                createdAt : "desc"
            }
        })  
    return NextResponse.json(data)
        
    } catch (error:any) {
        return NextResponse.json(error)
        
    } finally{
        await prisma.$disconnect()
    }
}