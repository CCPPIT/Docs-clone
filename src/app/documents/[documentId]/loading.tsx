import FullScreenLoader from '@/components/fullscreen-loader'
import React from 'react'

type Props = {}

const LoadingPage = (props: Props) => {
  return (
   <FullScreenLoader label='Document Loading....'/>
  )
}

export default LoadingPage