

import React from 'react'
import User from '@/models/user'
import connectDB from '@/db'

import MessageButton from '@/components/MessageButton'

const Usern = async ({params}) => {
     await connectDB();
    const {username}=await params;
    console.log("username",username);
    const user = await User.findOne({username:username});
    if(!user){
        return <div>User not found</div>
    }
    const userid = user._id;
 
  return (
    <div className="p-4 text-white">
        <h1>User Profile</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      <MessageButton receiverId={user._id.toString()} />
    </div>



  )
}

export default Usern