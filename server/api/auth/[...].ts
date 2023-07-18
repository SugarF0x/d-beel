import { NuxtAuthHandler } from "#auth"
import CredentialsProvider from 'next-auth/providers/credentials'

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
      authorize (credentials: any) {
        const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }

        if (credentials?.username === user.username && credentials?.password === user.password) return user

        console.error('Warning: Malicious login attempt registered, bad credentials provided')
        return null
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
})
