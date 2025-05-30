"use client"
import { NavBar } from "./navbar";
import TemplateGallery from "./template-gallery";
import { usePaginatedQuery,  } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DocumentTable from "./document-table";
import { useSearchParam } from "@/hooks/use-search-param";

export default function Home() {
  const [search]=useSearchParam();
  const {loadMore,status,results}=usePaginatedQuery(api.documents.getdocuments,{search},{initialNumItems:5})
  

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
