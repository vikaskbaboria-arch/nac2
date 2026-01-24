import React from 'react'
import MessagePage from '@/components/messagepage'
const page = async({params}) => {
    const {conversationId}= await params;
  return (
    <div><MessagePage conversationid={conversationId}/></div>
  )
}

export default page