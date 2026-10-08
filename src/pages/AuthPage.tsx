import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field, TextInput } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { signInSchema, signUpSchema, type SignInValues, type SignUpValues } from '@/lib/schemas'

type Mode = 'signin' | 'signup'

export function AuthPage({ mode }: { mode: Mode }) {
  const { user, enabled } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  useDocumentTitle(mode === 'signin' ? 'Sign in' : 'Create account')

  if (!enabled || user) return <Navigate to={from} replace />

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10 pb-safe pt-safe">
      <main id="main" className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span
            aria-hidden
            className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-600 text-white"
          >
            <span className="h-5 w-5 rounded-full border-2 border-white" />
          </span>
          <h1 className="text-h1">{mode === 'signin' ? 'Welcome back' : 'Start your journal'}</h1>
          <p className="mt-1 text-body text-ink-muted">
            {mode === 'signin'
              ? 'Sign in to pick up where you left off.'
              : 'A calm place to remember the meals and people you loved.'}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-soft">
          {mode === 'signin' ? <SignInForm from={from} /> : <SignUpForm from={from} />}
        </div>
        <p className="mt-6 text-center text-body text-ink-muted">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <Link
                to="/signup"
                state={{ from }}
                className="font-medium text-primary-700 underline"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" state={{ from }} className="font-medium text-primary-700 underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </main>
    </div>
  )
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-lg bg-danger-bg px-4 py-3 text-small font-medium text-danger"
    >
      {message}
    </p>
  )
}

function SignInForm({ from }: { from: string }) {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) })

  const onSubmit = async (values: SignInValues) => {
    setError(null)
    try {
      await signIn(values)
      navigate(from, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We couldn’t sign you in right now.')
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Email" htmlFor="auth-email" error={errors.email?.message}>
        <TextInput
          id="auth-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </Field>
      <Field label="Password" htmlFor="auth-password" error={errors.password?.message}>
        <TextInput
          id="auth-password"
          type="password"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </Field>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

function SignUpForm({ from }: { from: string }) {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = async (values: SignUpValues) => {
    setError(null)
    try {
      const { needsEmailConfirmation } = await signUp({
        email: values.email,
        password: values.password,
        displayName: values.display_name,
      })
      if (needsEmailConfirmation) setConfirmEmail(values.email)
      else navigate(from, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We couldn’t create your account right now.')
    }
  }

  if (confirmEmail) {
    return (
      <div role="status" className="space-y-3 text-center">
        <span
          aria-hidden
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage-50 text-sage-700"
        >
          <MailCheck className="h-6 w-6" />
        </span>
        <h2 className="text-h3">Check your email</h2>
        <p className="text-body text-ink-soft">
          We sent a confirmation link to <strong className="font-medium">{confirmEmail}</strong>.
          Open it, then come back here to sign in.
        </p>
        <Link
          to="/login"
          state={{ from }}
          className="inline-flex min-h-touch items-center font-medium text-primary-700 underline"
        >
          Go to sign in
        </Link>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Your name" htmlFor="auth-name" error={errors.display_name?.message}>
        <TextInput
          id="auth-name"
          autoComplete="given-name"
          invalid={Boolean(errors.display_name)}
          {...register('display_name')}
        />
      </Field>
      <Field label="Email" htmlFor="auth-email" error={errors.email?.message}>
        <TextInput
          id="auth-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </Field>
      <Field
        label="Password"
        htmlFor="auth-password"
        hint="At least 8 characters."
        error={errors.password?.message}
      >
        <TextInput
          id="auth-password"
          type="password"
          autoComplete="new-password"
          hasHint
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </Field>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
