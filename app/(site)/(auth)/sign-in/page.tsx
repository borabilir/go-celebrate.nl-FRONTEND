'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { FormEvent } from 'react'

import TextField from '@/components/form/TextField'
import Button from '@/components/atoms/Button'

export default function SignIn() {
    const router = useRouter()

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const result = await signIn('credentials', {
            redirect: false,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
        })
        if (result?.ok) {
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
        <div className="w-full max-w-md">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900">Sign in</h1>
            <p className="mt-2 text-sm text-gray-500">
                Or{' '}
                <a href="#" className="font-medium text-link">
                    create an account
                </a>
                .
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
