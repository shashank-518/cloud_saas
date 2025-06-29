import { clerkMiddleware , createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isPublicPath = createRouteMatcher([
    "/sign-up",
    "/sign-in",
    "/",
    "/mainpage"
]
)

const isPublicApi = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth,req)=>{
    const {userId} = await auth()
    const currentURL = new URL(req.url)

    const isHomePage = currentURL.pathname === "/mainpage"
    const isApiPage = currentURL.pathname.startsWith("/api")

    if(userId && isPublicPath(req) && isHomePage ){
        return NextResponse.redirect(new URL("/mainpage" , req.url))
    }
    
    if(!userId){
        if(!isPublicApi(req)    && !isPublicPath(req)){
            return NextResponse.redirect(new URL("/sign-up" , req.url))
            
        }
        
        if(isApiPage && !isPublicApi(req)){
            
            return NextResponse.redirect(new URL("/sign-up" , req.url))
        }

    }

   
    return NextResponse.next()


});

export const config = {
  matcher: [
   "/mainpage" ,
   
  ],
};