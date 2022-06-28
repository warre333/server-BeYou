import React from 'react'

import Chat from './Chat'

function MessagesList() {
  return (
    <div>
      <div className="container">
        <h1 className="text-center mmb-3">Chats</h1>

        <Chat />
      </div>
    </div>
  )
}

export default MessagesList