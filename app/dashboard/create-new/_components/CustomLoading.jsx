import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

function CustomLoading({ loading, status }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className='bg-white'>
        <div className='bg-white flex flex-col items-center mt-10 justify-center'>
          <Image src={'/loading.gif'} width={100} height={100} alt="Loading" />
          <h2>{status}</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomLoading;
