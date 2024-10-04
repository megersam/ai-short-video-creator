import { SignIn } from "@clerk/nextjs";
import Image from 'next/image'


export default function Page() {
    return (
        <div className='flex items-center justify-center h-screen'>
          <div className='w-full max-w-md p-4'>
            <SignIn />
          </div>
        </div>
      )
      
}