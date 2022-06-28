import React, {useState, useEffect} from 'react'
import sha256 from 'js-sha256'
import axios from 'axios'
import Cookies from 'universal-cookie'


import { AUTH } from '../../config/api.config'

import Error from '../states/Error'
import Success from '../states/Success'
import Loading from '../states/Loading'

const styles = {
    opacityBackground: {
        background: "rgba(33, 37, 41, .9)",
    },

    center: {
        top: "25%",
        left: "25%",
    },

    centerWhiteCard: {
        top: "25%",
        left: "25%",        
        borderRadius: "10px",
    },

    marginLeft25: {
        marginLeft: "12.5%",
    },
}

function Register(props) {
    const cookies = new Cookies()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [viewPassword, setViewPassword] = useState()

    async function register(){
        setLoading(true)

        if(username){
            if(email){
                if(password){
                    axios.post(AUTH + "register", {           
                        username: username,
                        email: email,
                        password: password,
                    })
                        .then((response) => {
                            console.log(response)
                            const success = response.data.auth

                            if(success){
                                setLoading(false)
                                setError("")
                                cookies.set("user", response.data.token, { path: '/' })
                                props.setPopup("none")
                                window.location.reload(false);
                            } else {
                                setLoading(false)
                                setError(response.data.message)
                            }
                        })
                } else {
                    setLoading(false)
                    setError("You should enter a password")
                }
            } else {
                setLoading(false)
                setError("You should enter an email")
            }                
        } else {
            setLoading(false)
            setError("You should enter a username")
        }
    }

  return (
    <div className='vw-100 vh-100 top-0 position-fixed' style={styles.opacityBackground}>
        {/* Darkend background */}
        <div className="w-50 h-50 top-25 left-25 position-fixed bg-light" style={styles.centerWhiteCard}>

            {/* centered white space */}
            <div className="h-100 text-center">
                <h1 className="text-center m-4">Register</h1>

                {!loading && (
                    <div className="w-75 p-2" style={styles.marginLeft25}>
                        <label htmlFor="email" className="text-start w-100 control-label">Email Address:</label>
                        <input type="email" name="email" id="email" className="form-control mb-2" onChange={(e) => { setEmail(e.target.value) }} />

                        <label htmlFor="username" className="text-start w-100 control-label">Username</label>
                        <input type="text" name="username" id="username" className="form-control mb-2" onChange={(e) => { setUsername(e.target.value) }} />

                        <label htmlFor="password" className="text-start w-100 control-label">Password</label>
                        <div className="input-group">
                            <input type={viewPassword ? "test" : "password"} name="password" id="password" className="form-control mb-2 password-revealable" onChange={(e) => { setPassword(sha256(e.target.value)) }} />
                            
                            <button className="input-group-text h-100" 
                                onClick={() => { 
                                    if(viewPassword){
                                        setViewPassword(false) 
                                    } else {
                                        setViewPassword(true)
                                    }
                                }}>
                                {!viewPassword && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path>
                                    </svg>
                                )}

                                {viewPassword && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="row mt-3">
                            <div className="col">
                                <button className="btn btn-primary w-100" onClick={register}>Register</button>
                            </div>

                            <div className="col">
                                <button className="btn btn-secondary w-100" onClick={() => { props.setPopup("login") }}>Login</button>
                            </div>
                        </div>   
                    </div>
                )} 

                {loading && (
                    <Loading />
                )}
            </div>
        </div>
    </div>
  )
}

export default Register