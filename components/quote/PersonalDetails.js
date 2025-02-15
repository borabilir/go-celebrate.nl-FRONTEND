import cn from 'classnames'
import { useEffect, useCallback } from 'react'
import { useWatch, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { Anchor } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { useTranslation, Trans } from 'next-i18next'

import TextField from '@/components/form/TextField'
import Checkbox from '@/components/form/Checkbox'

const schema = yup
    .object()
    .shape({
        firstName: yup.string().required('field_required'),
        lastName: yup.string().required('field_required'),
        email: yup.string().required('field_required').email('field_email_invalid'),
        phone: yup.string().required('field_required'),
        acceptTerms: yup
            .boolean()
            .required('field_terms_conditions_validation')
            .oneOf([true], 'field_terms_conditions_validation'),
    })
    .required()

export default function PersonalDetails({ onChange = () => {}, done, submit, defaultValues, className }) {
    const { t, i18n } = useTranslation(['common', 'quote'])

    // const defaultValues = {} // When implementing user login, provide user values here from the auth context

    const form = useForm({
        validate: yupResolver(schema),
        initialValues: {
            firstName: '',
            lastName: '',
            company: '',
            email: '',
            phone: '',
            acceptTerms: false,
        },
    })

    useEffect(() => {
        // If the user is logged in, make sure to prefill the form with their details
        if (defaultValues && defaultValues.id) {
            form.setValues({
                firstName: defaultValues.firstName || '',
                lastName: defaultValues.lastName || '',
                company: defaultValues.companyName || '',
                email: defaultValues.email || '',
                phone: defaultValues.phone || '',
                acceptTerms: false,
            })
        }
    }, [defaultValues])

    async function send() {
        form.onSubmit(
            (values) => {
                try {
                    done(values)
                } catch (error) {
                    console.error(error)
                    throw "Couldn't save user info"
                }
            },
            (error) => {
                /* Silent */
            }
        )()
    }

    return (
        <div className={cn('space-y-4 md:space-y-6', className)}>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
                <TextField
                    disabled={!!defaultValues}
                    name="firstName"
                    className="w-full"
                    label={t('first_name', { ns: 'common' })}
                    required={true}
                    {...form.getInputProps('firstName')}
                    error={
                        form.getInputProps('firstName').error
                            ? t(form.getInputProps('firstName').error, {
                                  ns: 'common',
                                  fieldName: 'firstName',
                              })
                            : undefined
                    }
                />
                <TextField
                    disabled={!!defaultValues}
                    name="lastName"
                    className="w-full"
                    label={t('last_name', { ns: 'common' })}
                    required={true}
                    {...form.getInputProps('lastName')}
                    error={
                        form.getInputProps('firstName').error
                            ? t(form.getInputProps('lastName').error, {
                                  ns: 'common',
                                  fieldName: 'lastName',
                              })
                            : undefined
                    }
                />
            </div>
            <TextField
                disabled={!!defaultValues}
                name="company"
                className="w-full max-w-lg"
                label={`${t('company_name', { ns: 'common' })} (${t('optional', { ns: 'common' })})`}
                {...form.getInputProps('company')}
            />
            <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
                <TextField
                    disabled={!!defaultValues}
                    name="email"
                    type="email"
                    className="w-full"
                    label={t('email', { ns: 'common' })}
                    required={true}
                    {...form.getInputProps('email')}
                    error={
                        form.getInputProps('email').error
                            ? t(form.getInputProps('email').error, {
                                  ns: 'common',
                                  fieldName: 'email',
                              })
                            : undefined
                    }
                />
                <TextField
                    disabled={!!defaultValues}
                    name="phone"
                    className="w-full"
                    label={t('phone', { ns: 'common' })}
                    required={true}
                    {...form.getInputProps('phone')}
                    error={
                        form.getInputProps('phone').error
                            ? t(form.getInputProps('phone').error, {
                                  ns: 'common',
                                  fieldName: 'phone',
                              })
                            : undefined
                    }
                />
            </div>
            <Checkbox
                name="acceptTerms"
                label={
                    <span className="text-sm text-gray-500">
                        <Trans
                            i18nKey="accept_toc_and_pp"
                            components={[
                                <Anchor
                                    key="terms-conditions"
                                    className="text-sm lowercase"
                                    href="/terms-conditions"
                                    target="_blank"
                                ></Anchor>,
                                <Anchor
                                    key="privacy-policy"
                                    className="text-sm lowercase"
                                    href="/privacy-policy"
                                    target="_blank"
                                ></Anchor>,
                            ]}
                            values={{
                                toc: t('terms_and_conditions', {
                                    ns: 'common',
                                }),
                                pp: t('privacy_policy', {
                                    ns: 'common',
                                }),
                            }}
                        ></Trans>
                    </span>
                }
                required={true}
                {...form.getInputProps('acceptTerms')}
                error={
                    form.getInputProps('acceptTerms').error
                        ? t(form.getInputProps('acceptTerms').error, {
                              ns: 'common',
                          })
                        : undefined
                }
            />
            {submit && <div className="spacer pb-2" />}
            {typeof submit === 'function' ? submit(send) : submit}
        </div>
    )
}
