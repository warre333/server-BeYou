import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"
import { useParams } from "react-router-dom"

import useWindowDimensions from '../hooks/useWindowDimensions'

import Header from "../components/header"

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import NOT_FOUND from "../images/NOT_FOUND.jpg"

import { AUTH, USERS } from '../config/api.config'
import Edit from '../components/profile/Edit'
import PreviewPost from '../components/posts/PreviewPost'

const styles = {
    profileImage: {
        height: "25vw",
        width: "25vw",
        objectFit: "cover",
    },
    profileImageDesktop: {
        height: "10vw",
        width: "10vw",
        objectFit: "cover",
    },
}

const cookies = new Cookies();

function Profile() {
    const [user, setUser] = useState()
    const [popup, setPopup] = useState()
    
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState()
  
    // {"user_id": 1, "username": "@warre002", "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquam congue fringilla. Phasellus aliquet porttitor placerat. Cras ligula odio, fringilla sit amet turpis in, semper lobortis metus. Phasellus id est odio. Morbi hendrerit enim et dui malesuada, a vulputate velit aliquam. Donec ut tortor dapibus, vulputate nulla rutrum, tristique ipsum.", "profile_image": "https://pbs.twimg.com/media/CmUPSBuUMAEvfoh.jpg", "verified": 0}
    const [profileInfo, setProfileInfo] = useState()
    // {"image": "https://cdn.discordapp.com/attachments/504315373969997835/975313956937801748/unknown.png", "caption": "tes caption"}
    const [profilePosts, setProfilePosts] = useState()
    
    const params = useParams()
    const profileUsername = params.username

    function getCookie(){
      if(cookies.get('user')){
        return cookies.get('user')
      }
    }  
  
    useEffect(() => {
      const cookie = getCookie()
    
      if(cookie){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": cookie
            },
          },
        ).then((response) => {
          if(response.data.auth){
           setUser(response.data.user_id)
          } else {
            setPopup("login")
            cookies.remove('abc', { path: '/' });
          }
        })
      } else { 
        setPopup("login")
      }
    }, [user])

    // Screen sizing
    const { width, height } = useWindowDimensions();
    const [isOnMobile, setIsOnMobile] = useState(false)

    useEffect(() => {
        if(width < 768){
            setIsOnMobile(true)
        } else {
            setIsOnMobile(false)
        }
    })

    async function getUserInfo(){
      // Get user info from api with userid
      // put in userinfo

      // Info, profile_image, bio, total followers, total posts
      axios.get(USERS + "profile?username=" + profileUsername).then((response) => {
        console.log(response)
        if(response.data.success){
          setProfileInfo(response.data.data.userInfo)
          setProfilePosts(response.data.data.posts)
        } else {
          setError(response.data.message)
        }
      })
    } 

    useEffect(() => {
      if(!profileInfo || !profilePosts){
        getUserInfo()
        setLoading(true)
      } else {
        setLoading(false)
      }
    })

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error changeMessage={setError} /> )}
        { success && ( <Success changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <div className="container">
            {/* row met image daarnaast username, bio, edit profile button */}
            {/* Image + username */}
            <div className="row">
                <div className="col-4 col-md-auto text-end">
                  {profileInfo && ( profileInfo.profile_image == "None" && ( <img src={NOT_FOUND} alt="profile_image" style={isOnMobile ? styles.profileImage : styles.profileImageDesktop} className="rounded-circle" /> ))}
                  {profileInfo && ( profileInfo.profile_image != "None" && ( <img src={profileInfo.profile_image} alt="profile_image" style={isOnMobile ? styles.profileImage : styles.profileImageDesktop} className="rounded-circle" /> ))}
                </div>

                <div className="col ms-md-3">
                    <table className="h-100">
                        <tbody>
                            <tr>
                                <td className="align-middle">
                                  {profileInfo && <h2 className="text-start ml-10">{profileInfo.username}</h2>}
                                </td>
                            </tr>
                        </tbody>                        
                    </table>
                </div>
            </div>


            {/* bio + edit */}
            <div className="m-2">
              {profileInfo && <p>{profileInfo.bio}</p> } 
            </div>

            <div className="m-2">
               {user && profileInfo && user == profileInfo.user_id && ( 
                 <div className="">
                   <button className="btn bg-light rounded-3 border w-100" onClick={(e) => { setPopup("edit_profile") }} >Edit profile</button>
                 </div>
               )}
            </div>

            {popup && popup == "edit_profile" && <Edit profile={profileInfo} setPopup={setPopup} />}

            <div className="border-bottom mt-4"></div>



            {/* Posts grid */}
            <div className="container my-5">
              <div className="row g-3">

                {profilePosts && profilePosts.length > 0 && (
                  profilePosts.map((post, key) => {
                    return <PreviewPost image={post.media_link} post_id={post.post_id} key={key} />
                  })
                )}

                {profilePosts && profilePosts.length == 0 && (
                  <h4 className="w-100 text-center">No posts are found...</h4>
                )}

              </div>
              
            </div>
        </div>
        
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

export default Profile