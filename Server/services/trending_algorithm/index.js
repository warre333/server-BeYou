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