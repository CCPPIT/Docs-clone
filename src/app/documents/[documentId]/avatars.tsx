"use client"
import { Separator } from '@/components/ui/separator';
import {   useOthers, useSelf } from '@liveblocks/react/suspense';
import {  ClientSideSuspense } from '@liveblocks/react';

import React from 'react'
import Image from 'next/image';

type Props = {
    src: string
    name: string
}
const SIZE_AVATAR=36;
export const Avatars=()=>{
    return(
        <ClientSideSuspense fallback={null}>
            <AvavtarStack/>

        </ClientSideSuspense>
    )
}
const AvavtarStack=()=>{
    const users=useOthers();
    const currentUser=useSelf();
    if(users.length===0)return null;
    return(
        <>
      
        <div className='flex items-center'>
            {currentUser&&(
                <div className='relative ml-2'>
                    <Avatar src={currentUser.info.avatar} name='You'/>

                </div>
            )}
            <div className='flex'>
                {users.map(({connectionId,info})=>{
                    return(
                        <Avatar key={connectionId} src={info.avatar} name={info.name}/>
                    )
                })}

            </div>

        </div>
        <Separator orientation='vertical' className='h-6'/>
        </>
    )
}

const Avatar = ({src,name}: Props) => {
  return (
    <div
    style={{
        width:SIZE_AVATAR,
        height:SIZE_AVATAR
    }}
     className='group -ml-2 flex shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400'>
      <div className='opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white
      text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity'>
        {name}

      </div>
      <Image src={src} alt={name}
      className="size-full rounded-full"
      />
    </div>
  )
}

export default Avatar