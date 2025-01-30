import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    username: string;
  }
}

declare global {
  interface Gamer {
    id?: number,
    username: string,
    salted_hash?: saltedHash,
    firstname?: string,
    lastname?: string
    profile_picture?: string,
    account_created?: Date,
    last_login?: Date
  }
}

declare global {
  interface UserConsole {
    id?: number,
    gamer_id: number,
    console_id: number,
    is_owned?: boolean,
    is_favorite?: boolean
  }
}

declare global {
  interface UserGame {
    id?: number,
    userconsole_id: number,
    game_id: number,
    is_owned?: boolean,
    is_completed?: boolean,
    is_favorite?: boolean,
    personal_rating?: number,
    personal_review?: string
  }
}

declare global {
  interface Console {
    id: number,
    name: string,
    maker: string,
    release_year: number,
    picture: string;
    is_handheld: boolean
  }
}

declare global {
  interface Game {
    rawg_id: number,
    name: string,
    lookup_name: string,
    released: Date,
    rating: number;
    background_image_link: string
  }
}