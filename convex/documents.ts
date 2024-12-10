import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
// تصدير دالة `getByIds` التي تستعمل لاسترجاع وثائق متعددة بناءً على معرفاتها
export const getByIds = query({
    // تعريف المعاملات المطلوبة للدالة
    args: { ids: v.array(v.id("documents")) }, // يتطلب مصفوفة من معرفات الوثائق

    // معالج الطلب
    handler: async (ctx, { ids }) => {
        const documents = []; // مصفوفة لتخزين الوثائق المسترجعة

        // حلقة لتكرار كل معرف في مصفوفة `ids`
        for (const id of ids) {
            // استرجاع الوثيقة من قاعدة البيانات باستخدام المعرف
            const document = await ctx.db.get(id);

            // التحقق مما إذا كانت الوثيقة موجودة
            if (document) {
                // إذا كانت الوثيقة موجودة، أضفها إلى المصفوفة مع معرفها وعنوانها
                documents.push({ id: document._id, name: document.title });
            } else {
                // إذا لم توجد الوثيقة، أضف عنصرًا بديلًا مع اسم "[Removed]"
                documents.push({ id, name: "[Removed]" });
            }
        }

        // إرجاع المصفوفة النهائية من الوثائق
        return documents;
    } 
});
export const create=mutation({
    args:{
        title:v.optional(v.string()),
        initialContent:v.optional(v.string())

    },
    handler:async(ctx,args)=>{
        const user=await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorized");

        }
        const organizationId=(user.organization_id??undefined)as
        |string|undefined;

        return await ctx.db.insert("documents",{
            title:args.title??"Untitled document",
            ownerId:user.subject,
            organizationId,
            initialContent:args.initialContent
        })

    }
});
export const removeById=mutation({
    args:{id:v.id("documents")},
    handler:async(ctx,args)=>{
        const user=await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorized")
        }
        const organizationId=(user.organization_id??undefined)as
        |string|undefined;
        const document=await ctx.db.get(args.id);
        if(!document){
            throw new ConvexError("Document not found")
        }
        const isOwner=document.ownerId===user.subject;

        const isOrganizationMember=!!(document.organizationId&&document.organizationId===organizationId);

        if(!isOwner && !organizationId){
            throw new ConvexError("Unauthorized");
        }
        return await ctx.db.delete(args.id)

    }
})
export const updateById=mutation({
    args:{id:v.id("documents"),
        title:v.string()
    },
    handler:async(ctx,args)=>{
        const user=await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorized")
        }
        const document=await ctx.db.get(args.id);
        if(!document){
            throw new ConvexError("Document not found")
        }
        const isOwner=document.ownerId===user.subject;
        const organizationId=(user.organization_id??undefined)as
        |string|undefined;
        const isOrganizationMember=!!(document.organizationId&& document.organizationId===organizationId);

       
        if(!isOwner &&!isOrganizationMember){
            throw new ConvexError("Unauthorized")

        }
        return await ctx.db.patch(args.id,{title:args.title})
    }
})

export const getdocuments=query({
    args:{paginationOpts:paginationOptsValidator,search:v.optional(v.string())},
    
    handler:async(ctx,{search,paginationOpts})=>{
        const user=await ctx.auth.getUserIdentity();
        if(!user){
            throw new ConvexError("Unauthorized")
        }
       const organizationId=(user.organization_id??undefined)as |string |undefined;
       if(search && organizationId){
        return await ctx.db.query("documents")
        .withSearchIndex("search_title",(q)=>
        q.search("title",search).eq("organizationId",organizationId))
        .paginate(paginationOpts)
       }
       if(organizationId){
        return await ctx.db.query("documents")
        .withIndex("by_organization_id",(q)=>
        q.eq("organizationId",organizationId)).paginate(paginationOpts)

       }
        if(search){
            return await ctx.db.query("documents")
            .withSearchIndex("search_title",(q)=>
            q.search("title",search).eq("ownerId",user.subject)).paginate(paginationOpts)
        }

        return await ctx.db.query("documents").withIndex("by_owner_id",(q)=>q.eq("ownerId",user.subject)).paginate(paginationOpts);

    }
})
export const getById=query({
    args:{id:v.id("documents")},
    handler:async(ctx,{id})=>{
        const document=await ctx.db.get(id)
        if(!document){
            throw new ConvexError("Document not found")
        }
        return document
    },
    
})