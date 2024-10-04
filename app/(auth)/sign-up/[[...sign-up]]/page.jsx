import { SignUp } from "@clerk/nextjs";



export default function Page(){
    return (
        <div className='flex items-center justify-center h-screen'>
          <div className='w-full max-w-md p-4'>
            <SignUp />
          </div>
        </div>
      )
      
}