import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { USERS } from '../../config/api.config';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import Cookies from "universal-cookie"

import NOT_FOUND from "../../images/NOT_FOUND.jpg"
// import "../../styles/colors.css"

const styles = {
    bg:  {
        position: "fixed",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        backgroundColor: "rgba(33, 37, 41, .9)"
    },

    button: {    
      background: "none",
      color: "inherit",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit",
    },

    centerWhiteCard: {
        top: "12.5%",
        left: "12.5%",        
    },

    centerWhiteCardMobile: {   
    },

    centerInputs: {
        marginLeft: "25%"
    },

    profileImage: {
        height: "50px",
        width: "50px",
    },
}

function Edit(props) {
    // Screen sizing
    const { width } = useWindowDimensions();
    const [isOnMobile, setIsOnMobile] = useState(false)
    const cookies = new Cookies()

    useEffect(() => {
        if(width < 768){
            setIsOnMobile(true)
        } else {
            setIsOnMobile(false)
        }
    })
    
    function getCookie(){
        if(cookies.get('user')){
          return cookies.get('user')
        }
    } 

    const profile = props.profile
    const [profileImage, setProfileImage] = useState(profile.profile_image)
    const [fileName, setFileName] = useState("");
    const [username, setUsername] = useState(profile.username.substring(1))
    const [bio, setBio] = useState(profile.bio)
    
    function changeProfileImage(){

    }

    async function saveData(){
        const cookie = getCookie()
        const formData = new FormData()
        formData.append('profileImage', profileImage)
        console.log(formData)
        // formData.append("profileImageName", fileName);
        // console.log(formData)

        axios.patch(USERS + "profile", formData, {
            headers: {
              "x-access-token": cookie,
              'Content-Type': 'multipart/form-data; boundary=XXX'
            },
          }).then((response) => {
            console.log(response)
        })
    }

  return (
    <div style={styles.bg}>
        <div className={isOnMobile ? "w-100 h-100 position-fixed bg-light" : "w-75 h-75 position-fixed bg-light rounded-3"} style={isOnMobile ? styles.centerWhiteCardMobile : styles.centerWhiteCard}>
            {/* The top, x (doesn't save states) edit profile checkmark */}
            <div id="top" className="row m-3">
                <div className="col-1 align-items-center justify-content-center">
                    <button style={styles.button} onClick={() => { props.setPopup("none") }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>  
                    </button> 
                </div>

                <div className="col">
                    <h2 className="text-center">Edit profile</h2>
                </div>
                
                <div className="col-1 align-items-center justify-content-center">
                    <button style={styles.button} onClick={saveData}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="blue" className="bi bi-check2" viewBox="0 0 16 16">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                    </button>                    
                </div>
            </div>

            {/* Input fields save on checkmark click */}
            <div className="text-center h-75" >
                {/* Profile image + change image */}
                <div className="">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" className="rounded-circle" height="100">
                            {profile.profile_image && ( profile.profile_image == "None" && (
                                <image href={NOT_FOUND} width="100" height="100" />
                            ))}
                            {profile.profile_image && ( profile.profile_image != "None" && (
                                <image href={profile.profile_image} width="100" height="100"/>
                            ))}
                        </svg>
                    </div>

                    <div className="w-50 mt-3" style={styles.centerInputs}> 
                        <label htmlFor="" className="w-100 text-center">Change profile image</label>
                        <input type="file" onChange={(e) => { setProfileImage(e.target.files[0]); setFileName(e.target.files[0].name)}} className="text-primary mt-1 mb-3" style={styles.button} />
                    </div>
                </div>

                {/* username, bio */}
                <div className="w-50 mt-3" style={styles.centerInputs}> 
                    <label htmlFor="username" className="w-100 text-start">
                        Username
                    </label>
                    <input
                        type="text" 
                        name='username' 
                        className="w-100" 
                        defaultValue={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    />

                    <label htmlFor="bio" className="w-100 text-start mt-3">
                        Bio
                    </label>
                    <input 
                        type="text" 
                        name='bio' 
                        className="w-100" 
                        defaultValue={bio}
                        onChange={(e) => {
                            setBio(e.target.value)
                        }}
                    />
                </div>                                   
            </div>
        </div>
    </div>
  )
}

export default Edit