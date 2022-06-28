import React from 'react'
import Friend from './Friend'

function FriendsList() {
  return (
    <div>        
      <div className="container">
        <h1 className="text-center mb-3">Friends</h1>

        {/* Mapping of friends list */}
        <Friend username={"MILF"} user_image={"https://pbs.twimg.com/media/CmUPSBuUMAEvfoh.jpg"}  />
      </div>
    </div>
  )
}

export default FriendsList