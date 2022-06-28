import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import Header from '../components/header'
import PostList from '../components/posts/PostList'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH, POSTS } from '../config/api.config'

const cookies = new Cookies();

function Homepage() {
  const [user, setUser] = useState()
  const [posts, setPosts] = useState()
  const [popup, setPopup] = useState("none")
  
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
      const cookies = getCookie()
  
      if(cookies){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": cookies
            },
          },
        ).then((response) => {
          if(response.data.auth){
            setUser(response.data.user_id)

            axios.get(POSTS + "feed",
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
        { loading && ( <Loading /> )}
        
        <PostList posts={posts} setError={setError} />  
        
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

export default Homepage