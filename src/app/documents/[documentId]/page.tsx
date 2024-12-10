
import React from 'react'

import { Id } from '../../../../convex/_generated/dataModel'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { Document } from './document'

type Props = {
  params:Promise<{documentId:Id<"documents">}>;
}

export const DocumentIdPage = async({params}: Props) => {
 
   const {documentId}=await params;
   const {getToken}=await auth();
   const token= await getToken({template:"convex"})?? undefined;
   if(!token){
    throw new Error("Unauthorized")
   }
   const preloadedDocument=await preloadQuery(
    api.documents.getById,{id:documentId},
    {token}
   )
   if(!preloadedDocument){
    throw new Error("Document not found")
   }
  return <Document preloadedDocument={preloadedDocument}/>
}

export default DocumentIdPage