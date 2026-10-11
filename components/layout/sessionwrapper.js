"use client"
import React, { Children } from 'react'
import { SessionProvider } from "next-auth/react";
const Sessionwrapper = ({children}) => {
  return (
   <SessionProvider>
   {children}

   </SessionProvider>
  )
}

export default Sessionwrapper