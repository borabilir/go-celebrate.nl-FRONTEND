import { type AuthOptions } from 'next-auth'
import { signIn } from '@/lib/auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
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
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...token.user,
                },
            }
        },
        jwt: ({ token, trigger, user, session }) => {
            /**
             * We only have the user object when jwt is called after authorize In other cases, user is
             * null and token contains the full user object that we encoded in the JWT
             */
            let serializeToken = token
            if (user) {
                serializeToken = {
                    ...token,
                    user,
                }
            }
            /**
             * If we need to bake in stg, e.g. after updating the user or setting a new onboarding state.
             * See more at: https://next-auth.js.org/getting-started/client#updating-the-session
             */
            if (trigger === 'update' && session?.user) {
                serializeToken = {
                    ...token,
                    user: {
                        ...token.user,
                        ...session.user,
                    },
                }
            }
            return serializeToken
        },
    },
    session: {
        strategy: 'jwt',
    },
}
