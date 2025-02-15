import Head from 'next/head'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from '@mantine/form'

import AuthLayout from '@/layouts/auth'
import TextField from '@/components/form/TextField'
import Button from '@/components/atoms/Button'

export default function SignIn() {
    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()
        const result = await signIn('credentials', {
            redirect: false,
            email: e.target.email.value,
            password: e.target.password.value,
        })
        if (result.ok) {
            router.replace('/app')
            return
        }
        alert('Credential is not valid')
    }
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    })

    return (
        <div>
            <Head>
                <title>Sign in</title>
            </Head>
            <h1 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-sm text-gray-500">
                Or{' '}
                <a href="#" className="font-medium text-link">
                    register for free
                </a>
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-6">
                <TextField {...form.getInputProps('email')} label="Email" name="email" type="email" />
                <TextField {...form.getInputProps('password')} label="Password" name="password" type="password" />
                <Button className="w-full" blok={{ type: 'primary', block: true, dense: true }}>
                    Sign In
                </Button>
            </form>
        </div>
    )
}

SignIn.Layout = AuthLayout
