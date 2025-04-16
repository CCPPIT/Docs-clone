import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { Document } from './document'

type Props = {
  params: { documentId: Id<"documents"> }; // التصحيح هنا فقط
}

export default async function DocumentId ({params}: Props) {
   const {documentId} = await params; // إزالة await هنا
   const {getToken} = await auth();
   const token = await getToken({template:"convex"}) ?? undefined;
   
   if(!token){

    throw new Error("Unauthorized")
   }
   
   const preloadedDocument = await preloadQuery(
    api.documents.getById,
    {id:documentId},
    {token}
   )
   
   if(!preloadedDocument){
    throw new Error("Document not found")
   }
   
   return <Document preloadedDocument={preloadedDocument}/>
}

