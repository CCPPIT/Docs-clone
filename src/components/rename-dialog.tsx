"use client"
import React, { useState } from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface Props {
    documentId:Id<"documents">
    initialTitle:string
    children:React.ReactNode
    
   

}

const RenameDialog = ({documentId,initialTitle,children}: Props) => {
    const update =useMutation(api.documents.updateById);
    const [isUpdating,setIsUpdating]=useState(false);
    const [title,setTitle]=useState(initialTitle);
    const [open,setOpen]=useState(false)
    const onSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setIsUpdating(true);
       
        update({id:documentId, title: title.trim() || "Untitled"})
        .catch(()=>toast.error("Something went wrong"))
        .then(()=>toast.success("Document renamed"))
        .finally(()=>{
            setIsUpdating(false)
            setOpen(false)

        })
       

    }
  return (
   <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        {children}

    </DialogTrigger>
    <DialogContent onClick={(e)=>e.stopPropagation()}>
        <form onSubmit={onSubmit}>
            <DialogHeader>
                <DialogTitle>Rename Document</DialogTitle>
                <DialogDescription>Enter a new name for this document</DialogDescription>
            </DialogHeader>
            <div className='my-4'>
                <Input
                value={title}
                
                onChange={(e)=>setTitle(e.target.value)}
                placeholder='Document Name'
               
                
                />

            </div>
            <DialogFooter>
                <Button
                type='button'
                variant={"ghost"}
                disabled={isUpdating}
                onClick={(e)=>{
                    e.stopPropagation();
                    setOpen(false)
                }
                    
                }

                >
                    Cancel
                </Button>
                <Button
                type='submit'
                variant={"ghost"}
                disabled={isUpdating}
                onClick={(e)=>e.stopPropagation()}
                >
                    Save
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
   </Dialog>
  )
}

export default RenameDialog