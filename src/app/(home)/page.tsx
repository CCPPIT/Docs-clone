"use client"
import Image from "next/image";
import { NavBar } from "./navbar";
import Link from "next/link";
import TemplateGallery from "./template-gallery";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DocumentTable from "./document-table";

export default function Home() {
  const {loadMore,status,isLoading,results}=usePaginatedQuery(api.documents.getdocuments,{},{initialNumItems:5})
  

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <NavBar/>
      </div>
      <div className="mt-16">
        <TemplateGallery/>
        <DocumentTable
        documents={results}
        status={status}
        loadMore={loadMore}
        />
    
      </div>
    
    </div>
  );
}
