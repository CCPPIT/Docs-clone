import React from 'react'
import {BsCloudCheck}from "react-icons/bs"

type Props = {}

const DocumentInput = (props: Props) => {
  return (
    <div className='flex items-center gap-2'>
        <span className='text-lg px-1.5 cursor-pointer truncate'>Untitled Document</span>
        <BsCloudCheck/>
    </div>
  )
}

export default DocumentInput