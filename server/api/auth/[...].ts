import { NuxtAuthHandler } from "#auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from "next-auth"

// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
const Provider = CredentialsProvider.default ?? CredentialsProvider

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET ?? 'fallback-dev-secret',
  providers: [
    Provider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
      },
      authorize(credentials: any) {
        const user = { id: '1', username: 'jsmith', password: 'hunter2' }

        if (credentials?.username === user.username && credentials?.password === user.password) return { username: user.username }

        console.error('Warning: Malicious login attempt registered, bad credentials provided')
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }){
      if (user) token.user = user
      return token
    },
    async session({ token, session }) {
      return { ...session, user: token.user as User }
    }
  },
  pages: {
    signIn: '/login'
  }
})
