import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signIn } from '@/lib/auth'

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Sign in with Email',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                /**
                 * This function is used to define if the user is authenticated or not.
                 * If authenticated, the function should return an object contains the user data.
                 * If not, the function should return `null`.
                 */
                if (credentials == null) return null
                /**
                 * credentials is defined in the config above.
                 * We can expect it contains two properties: `email` and `password`
                 */
                try {
                    const { user, jwt } = await signIn({
                        email: credentials.email,
                        password: credentials.password,
                    })
                    return { ...user, jwt }
                } catch (error) {
                    // Sign In Fail
                    console.error('Sign In Fail', error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        session: ({ session, token, user }) => {
            //  "session" is current session object
            //  below we set "user" param of "session" to value received from "jwt" callback
            session.user = token.user
            return session
        },
        jwt: ({ token, user }) => {
            //  "user" parameter is the object received from "authorize"
            //  "token" is being send below to "session" callback...
            //  ...so we set "user" param of "token" to object from "authorize"...
            //  ...and return it...
            user && (token.user = user)
            return token
        },
    },
    session: {
        strategy: 'jwt',
    },
}

export default NextAuth(authOptions)
