# VidCat Backend Repository
Live on Render at https://vidcat-backend.onrender.com/

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Knex.js
- PostgreSQL
- RAWG API
- OpenAI API

## Architecture

### Database Tables

- `gamer`: Stores users
  
- `console`: Stores custom-prepared game console data
  
- `userconsole`: Stores the consoles that users register on their accounts. Each entry is related to a specific `gamer` and a specific `console`
  
- `game`: Stores RAWG API official video game data
  
- `usergame`: Stores the games that users register on their accounts. Each entry is related to a specific `gamer`, a specific `userconsole` they previously registered, and a specific `game`

- `follower`: Stores `follower_id` and `followee_id`, representing the relationship between two gamers. The combination of these two fields also serves as the record's primary key

### Endpoints

#### User (Gamer) related

- POST `/signup`: Used to create a new user account. Expects `username` and `password` in the JSON request body. Responds with the user object that was created

- POST `/login`: Used to log in with an existing user account. Expects `username` and `password` in the JSON request body. Responds with the corresponding user object

- GET `/session`: Used to confirm if logged in. If logged in, responds with the logged in user's `gamerID`

- POST `/logout`: Used to log out of a user account. Does not expect anything in the request body

- PATCH `/gamer/:id`: Used to update the target user with the payload sent in the body. Responds with the updated user object

- GET `/profile/:username`: Used to get the public profile of the user. Responds with an object containing the user's `userconsoles` (array), `usergames` (array), and `profilePicture` (string)

- GET `/recommendation`: Used to get an AI-generated game recommendation similar to a specific game that the user owns. The game must be specified using the query parameter `rawg_id`. Responds with a single JSON object representing the recommended game, consisting of `name`, `release_year`, `consoles` (a comma-separated string), and `reason`

#### Console related

- GET  `/console`: Used to get an array consisting of all consoles

- GET  `/console/:id`: Used to get a single console by its ID

#### Userconsole related

- GET  `/userconsole/:id`: Used to get a single userconsole by its ID
  
- GET  `/gamer/:id/userconsole`: Used to get an array consisting of all userconsoles associated with a given gamer ID

- POST `/gamer/:id/userconsole`: Used to create a new userconsole associated with the given gamer ID. Responds with the newly created userconsole object
  
- PATCH `/userconsole/:id`: Used to update the target userconsole with the payload sent in the body. Responds with the updated userconsole object

- DELETE `/userconsole/:id`: Used to delete the target userconsole. Any associated usergames will also be deleted. Responds with an object containing the deleted `userconsole` object and an array of deleted `usergame` objects

#### Game related

- GET  `/game`: Used to get an array consisting of all games (for performance reasons, the `rawg_id` and `name` attributes only) or a selection of 40 games (including all attributes) depending on whether the query parameter `page` is included in the request. When paginated results are requested, responds with an object containing `games` (array), `gameRangeStart` (number), `gameRangeEnd` (number), `currentPage` (number), `totalPages` (number), and `totalGames` (number)

- GET  `/game/:id`: Used to get a single game by its ID

- GET  `/game/:id/screenshot`: Used to get screenshots (an array of string URLs) for a given game directly from RAWG API (as opposed to from the database)

#### Usergame related

- GET  `/usergame/:id`: Used to get a single usergame by its ID
  
- GET  `/gamer/:id/usergame`: Used to get an array consisting of all usergames associated with a given gamer ID

- GET  `/userconsole/:id/usergame`: Used to get an array consisting of all usergames associated with a given userconsole ID

- POST `/gamer/:id/usergame`: Used to create a new usergame associated with the given gamer ID. Responds with the newly created usergame object
  
- PATCH `/usergame/:id`: Used to update the target usergame with the payload sent in the body. Responds with the updated usergame object

- DELETE `/usergame/:id`: Used to delete the target usergame. Responds with the deleted usergame

#### Follower related

- GET  `/gamer/:id/follower`: Used to get an array consisting of all gamers in a follower-followee relationship with the given gamer ID. Expects a query parameter `type` that controls whether it responds with all of the followers of the gamer (`type='followers'`) or all followees the gamer is following (`type='following'`). In either case, the response array contains objects consisting of `id`, `username`, and `profile_picture`

- GET  `/gamer/:id/follower/count`: Used to the get `follower_count` and `following_count` for a given gamer ID

- POST `/gamer/:id/follower`: Used to create a new follower-followee relationship, representing the act of following. Expects `followee_id` in the request body. Responds with the newly created relationship
  
- DELETE `/gamer/:id/follower/:followee_id`: Used to delete the target follower-followee relationship, representing the act of unfollowing. Responds with the deleted relationship

### Authentication
Handled using a combination of `bycrypt` and `express-session`