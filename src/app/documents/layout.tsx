import React from 'react'

type Props = {
    children:React.ReactNode
}

const DocumentsLayout = ({children}: Props) => {
  return (
    <div className='flex flex-col gap-y-4'>
        {/* <nav className='w-full bg-red-500'>NavBar</nav> */}
        {children}
        </div>
  )
}

export default DocumentsLayout