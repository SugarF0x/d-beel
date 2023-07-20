import "next-auth"
import "next-auth/jwt"

type User = {
  username: string
}

declare module "next-auth" {
  export type User = User
  export interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    user: User
  }
}
