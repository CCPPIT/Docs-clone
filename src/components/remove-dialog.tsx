"use client"
import React, { useState } from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
    documentId:Id<"documents">
    children:React.ReactNode

}

const RemoveDialog = ({documentId,children}: Props) => {
    const router=useRouter();
    const remove=useMutation(api.documents.removeById);
    const [isRemoving,setIsRemoving]=useState(false);
    const onRomvingClick=()=>{
        setIsRemoving(true);
        remove({id:documentId})
        .catch(()=>toast.error("Something went wrong"))
        .then(()=>{
            toast.success("Document removed")
            router.push("/")

        }
            )
        .finally(()=>setIsRemoving(false))

    }
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e)=>e.stopPropagation()}>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your document
                </AlertDialogDescription>

            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={(e)=>e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                disabled={isRemoving}
                onClick={onRomvingClick}
                >Delete</AlertDialogAction>
            </AlertDialogFooter>

        </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveDialog