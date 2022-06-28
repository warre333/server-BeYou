//  The concept of the Trending Feed Algorithm: 
// 
//  - The algortihm returns all the top posts from the couple of the (last) hour(s)/day(s)
//
//  - For the algorithm all the posts should have "a score" that's saved in the database
//      => This score is calculated based on comments, likes, days past after posting  
//          => Example of the calculation: ranking = (numberOfComments * commentsWeight + numberOfLikes * likesWeight) / (daysSincePost * gravity)
//          => In the above example the commentsWeight could be something like 2, likesWeight: 1, gravity: 0.2
//              => This formula will result in that the posts with a lot of interactions are doing better while not many days since the post has been placed 
//              => If the days since post is high, the score will become lower because of the gravity
//      => When requested, you get the posts by selecting all posts (that are not seen: underneath more info), DESC on ranking / shuffle them.
//          => Posts already seen: Save in DB and remove the videos from the table with a lower ranking then xxxxx

const { COMMENTSWEIGHT, LIKESWEIGHT, DAYSGRAVITY } = require("../../config/algorithm.config")
const db = require("../../middleware/database/database.connection")

// Calculate the ranking based on the standard formula, info above in comments
function calculateRanking(comments, likes, daysSincePost){
    return (comments * COMMENTSWEIGHT + likes * LIKESWEIGHT) / (daysSincePost * DAYSGRAVITY)
}

// Calculate the days since the post has been posted
function calculateDaysSincePost(time_placed){
    const timestamp_now = new Date()
    const difference = timestamp_now.getTime() - time_placed
    const differenceInDays = ((((difference / 1000) / 60) / 60) / 24)
    
    return differenceInDays
}

// Get all info to do the formula, fire the formula function, update in database
async function changePostRanking(post_id){
    let comments = 0;
    let likes = 0;
    let daysSincePost = 0;


    db.query("SELECT * FROM tblposts WHERE post_id = ?", [post_id], (err, result) => {
        if(err){
            console.log(err)
        } else {
            if(result.length > 0){
                const time_placed = result[0].time_placed

                db.query("SELECT count(*) AS totalComments FROM tblcomments WHERE post_id = ?", [post_id], (err, result) => {
                    if(err){
                        console.log(err)
                    } else {
                        comments = result[0].totalComments

                        db.query("SELECT count(*) AS totalLikes FROM tblLikes WHERE post_id = ?", [post_id], (err, result) => {
                            if(err){
                                console.log(err)
                            } else {
                                likes = result[0].totalLikes
                                daysSincePost = calculateDaysSincePost(time_placed)

                                const newRanking = calculateRanking(comments, likes, daysSincePost)
    
                                db.query("UPDATE tblposts SET ranking = ? WHERE post_id = ?", [newRanking, post_id], (err, result) => {
                                    if(err){
                                        console.log(err)
                                    } 
                                })
                            }
                        })
                    }
                })                
            }                        
        }
    })
}

// Loop over all the posts
function changeAllPostRanking(){
    db.query("SELECT * FROM tblposts ORDER BY post_id DESC", (err, result) => {
        if(result?.length > 0){
            for(let i = 1; i <= result[0].post_id; i++){
                changePostRanking(i)
            }
        }
        
    })
}

// Repeat to loop over all the posts every x seconds
setInterval(changeAllPostRanking, 10000)