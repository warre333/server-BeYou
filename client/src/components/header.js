import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from "universal-cookie"

import { AUTH, USERS } from '../config/api.config';

import Logo from "../images/logo.png"
import NOT_FOUND from "../images/NOT_FOUND.jpg"
import Login from './auth/Login';
import Register from './auth/Register';

const styles = {
    header_container: {
        width: '100vw',
        margin: 0,
    },

    logo: {
        height: '80%',
        width: '50px',
        objectFit: 'cover',
    }
};

function Header() {
    const cookies = new Cookies()

    const [user, setUser] = useState()
    const [popup, setPopup] = useState()

    function logout(){
        // Log out
        cookies.remove("user", {path: "/"})
        setUser("")
        window.location.reload(false);
    }

    /*

        Make function that checks if it got a prop for setPosts, if it has and the person has been logged in, change setPosts to 0

    */

    useEffect(() => {
        const cookie = cookies.get("user")
    
        if(cookies){
          axios.get(AUTH,
            {
              headers: {
                "x-access-token": cookie
              },
            },
          )
            .then((response) => {  
                if(response.data.auth){
                    axios.get(USERS + "user?user_id=" + response.data.user_id).then((response) => {
                        if(response.data.success){
                            setUser(response.data.data)
                        }
                    }) 
                }             
            })
        } 
        
        
    }, [])
    
    function getCookie(){
      if(cookies.get('user')){
        return cookies.get('user')
      }
    }  
  
    useEffect(() => {
      function isAuthenticated(){
    
        if(cookies){
          axios.get(AUTH,
            {
              headers: {
                "x-access-token": getCookie()
              },
            },
          )
            .then((response) => {
                if(response.data.auth){
                    axios.get(USERS + "user?user_id=" + response.data.user_id).then((response) => {
                        if(response.data.success){
                            setUser(response.data.data)
                        }
                    }) 
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
        <header className="navbar p-3 mb-3 border-bottom bg-light">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <img src={Logo} alt="logo" style={styles.logo}/>
                    </a>

                    <ul className="nav col-auto col-lg-auto me-lg-auto mb-2  mb-md-0">
                        <li><a href="/explore" className="nav-link px-2 link-dark">Explore</a></li>
                        <li><a href="/friends" className="nav-link px-2 link-dark">Friends</a></li>
                        <li><a href="/messages" className="nav-link px-2 link-dark">Messages</a></li>
                        {/* Shopping page */}
                    </ul>

                    <form className="col-auto mb-0 me-3 ms-3 ms-lg-0">
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
                    </form>

                    <div className="dropdown text-end">
                        <a href="/" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            {user && ( user.profile_image == "None" && ( <img src={NOT_FOUND} alt="profile_image" width="32" height="32" className="rounded-circle" /> ))}
                            {user && ( user.profile_image != "None" && ( <img src={user.profile_image} alt="profile_image" width="32" height="32" className="rounded-circle" /> ))}
                        </a>
                        <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                            {user && ( <li><a className="dropdown-item" href={"/profile/" + user.username}>Profile</a></li> )}
                            <li><a className="dropdown-item" href="/create">Create Post</a></li>
                            <li><a className="dropdown-item" href="/settings">Settings</a></li>

                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Login & register popups */}
            { popup === "login" && (
            <Login setPopup={setPopup} />
            )}

            { popup === "register" && (
            <Register setPopup={setPopup} />
            )}
        </header>
  )
}

export default Header