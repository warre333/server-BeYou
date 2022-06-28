import React from 'react'
import NormalPost from './NormalPost'

import { WEBSITE_URL } from '../../config/api.config'

function PostList(props) {
  const posts = props.posts

  return (
    <div>
        <div className="posts__container">
          { posts && (
            posts.map((post, index) => {
              return <NormalPost image={post.media_link} key={index} user_id={post.user_id} caption={post.caption} share_link={WEBSITE_URL + "post/" + post.post_id} post_id={post.post_id} time_placed={post.time_placed} setError={props.setError} />
            })
          )}
        </div>
    </div>
  )
}

export default PostList