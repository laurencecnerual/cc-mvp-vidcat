# VidCat Backend Repository
Live on Render at https://vidcat-backend.onrender.com/

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Knex.js
- PostgreSQL

## Architecture

### Database Tables

- `gamer`: Stores users
  
- `console`: Stores custom-prepared game console data
  
- `userconsole`: Stores the consoles that users register on their accounts. Each entry is related to a specific `gamer` and a specific `console`
  
- `game`: Stores RAWG API official video game data
  
- `usergame`: Stores the games that users register on their accounts. Each entry is related to a specific `gamer`, a specific `userconsole` they previously registered, and a specific `game`

### Endpoints

#### User (Gamer) related

- POST `/signup`: Used to create a new user account. Expects `username` and `password` in the JSON request body. Responds with the user object that was created

- POST `/login`: Used to log in with an existing user account. Expects `username` and `password` in the JSON request body. Responds with the corresponding user object

- GET `/session`: Used to confirm if logged in. If logged in, responds with the logged in user's `gamerID`

- POST `/logout`: Used to log out of a user account. Does not expect anything in the request body

- PATCH `/gamer/:id`: Used to update the target user with the payload sent in the body. Responds with the updated user object

- GET `/profile/:username`: Used to get the public profile of the user. Responds with an object containing the user's `userconsoles` (array), `usergames` (array), and `profilePicture` (string)

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

- GET  `/game`: Used to get an array consisting of all games

- GET  `/game/:id`: Used to get a single game by its ID

#### Usergame related

- GET  `/usergame/:id`: Used to get a single usergame by its ID
  
- GET  `/gamer/:id/usergame`: Used to get an array consisting of all usergames associated with a given gamer ID

- GET  `/userconsole/:id/usergame`: Used to get an array consisting of all usergames associated with a given userconsole ID

- POST `/gamer/:id/usergame`: Used to create a new usergame associated with the given gamer ID. Responds with the newly created usergame object
  
- PATCH `/usergame/:id`: Used to update the target usergame with the payload sent in the body. Responds with the updated usergame object

- DELETE `/usergame/:id`: Used to delete the target usergame. Responds with the deleted usergame

### Authentication
Handled using a combination of `bycrypt` and `express-session`