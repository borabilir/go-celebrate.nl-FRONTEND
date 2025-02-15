import axios from 'axios'

const strapiUrl = process.env.NEXT_PUBLIC_MDM_API_URL

export async function signIn({ email, password }) {
    // Authenticate the user against the server
    const res = await axios.post(`${strapiUrl}/api/auth/local`, {
        identifier: email,
        password,
    })
    // Fetch the user profile with the provided token
    const me = await axios.get(`${strapiUrl}/api/users/me?populate=*`, {
        headers: {
            Authorization: `Bearer ${res.data.jwt}`,
        },
    })
    return {
        jwt: res.data.jwt,
        user: me.data,
    }
}
