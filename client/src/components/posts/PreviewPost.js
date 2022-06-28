import React from 'react'
import { Link } from 'react-router-dom';

const styles = {
    bg: {
        maxWidth: "100%",
        maxHeight: "20v",
        aspectRatio: "1 / 1",
        background: "radial-gradient(circle, rgba(69,69,69,1) 0%, rgba(20,20,20,1) 80%)",
    },

    image: {
        maxHeight: "100%",
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        objectFit: "contain",
    },
      
    buttonbg: {    
        background: "none",
        color: "inherit",
        border: "none",
        padding: 0,
        font: "inherit",
        cursor: "pointer",
        outline: "inherit",
        // width: "100%",
        // aspectRatio: "1 / 1",
    },
    
    keepRatio: {
      width: "100%",
      aspectRatio: "1 / 1",
    },
}

function PreviewPost(props) {
  return (
    <div className="col-4 text-center rounded-3"  >
      <Link to={"/posts/" + props.post_id}>
        <div className="bg-light border justify-content-center text-center align-middle" style={styles.bg}>
          <table style={styles.keepRatio}>
            <tbody style={styles.keepRatio}>
              <tr style={styles.keepRatio}>
                <td style={styles.keepRatio}><img src={props.image} alt="user post" className="" style={styles.image} /></td>
              </tr>
            </tbody>
          </table>
        </div> 
      </Link>       
    </div>
  )
}

export default PreviewPost