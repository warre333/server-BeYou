import React from 'react'

const styles = {
    image: {
        objectFit: "contain",
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
  
    postComment: {
      height: "4vh",
    },
}

function Friend(props) {
  return (
    <div>
        <div className="bg-light border rounded-4">
            <div className="row">
                <div className="col-8">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <svg width="50" height="50" className='rounded-circle m-2'>
                                    <image href={props.user_image} style={styles.image} height="50" width="50" />
                                    </svg>
                                </td>  

                                <td>
                                    <h4 className="font-weight-normal small align-middle">{props.username}</h4>
                                </td>
                            </tr>
                        </tbody>
                        
                    </table> 
                </div>
                
                <div className="col">
                    <table className="h-100">
                        <tbody>
                            <tr>
                                <td>
                                    <a className="btn btn-primary align-middle" href={"/profile/" + "1"}>profile</a>
                                </td>
                            
                                <td>
                                    <a className="btn btn-primary align-middle" href={"/message/"}>message</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>            
        </div>
    </div>
  )
}

export default Friend