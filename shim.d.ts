import "next-auth"
import "next-auth/jwt"
import { JWT as NativeJWT } from "next-auth/jwt"

interface AppUser {
  username: string
}

declare module "next-auth" {
  export type User = AppUser
  export interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  export interface JWT extends NativeJWT {
    user: AppUser
  }
}

declare global {
  namespace inspector {
    interface Session {
      user: AppUser
    }
  }
}
