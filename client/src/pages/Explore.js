import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import Header from '../components/header'
import PostList from '../components/posts/PostList'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'

import { AUTH, POSTS } from '../config/api.config'

const cookies = new Cookies();

function Explore() {
  const [user, setUser] = useState()
  const [posts, setPosts] = useState()
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  function getCookie(){
    if(cookies.get('user')){
      return cookies.get('user')
    }
  }  

  useEffect(() => {
    function isAuthenticated(){
      const cookie = cookies.get("user")
  
      if(cookies){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": cookie
            },
          },
        ).then((response) => {
          if(response.data.auth){
            setUser(response.data.user_id)

            axios.get(POSTS + "trending",
              {
                headers: {
                  "x-access-token": cookies
                },
              },
            ).then((response) => {
              if(response.data.success){
                setPosts(response.data.data)
              } else {
                setError("An unkown error has occurred.")
              }              
            })
          } else {            
            setUser(0)
            setPopup("login")
          }          
        })
      } else { 
        setUser(0)
        setPopup("login")
      }
    }

    isAuthenticated()
  }, [])
  

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error changeMessage={setError} /> )}
        { success && ( <Success changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <PostList posts={posts} />


        {/* Login & register popups */}
        { popup === "login" && (
          <Login setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading} />
        )}

        { popup === "register" && (
          <Register setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading}  />
        )}
        
    </div>
  )
}

export default Explore