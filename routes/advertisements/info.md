# Advertisement system

## How it works

1. User can click on the 3 dots of a post
2. They go to a ad panel with the post_id as parameter
3. The post is previewed on top, you can enter: an amount, starting date (today), ending date
    3.1) Stripe payment is created
    3.2) Stripe gets paid
    3.3) Save to db
4. Post gets randomized with regulars