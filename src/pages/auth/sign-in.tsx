import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

const signInForm = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SingInForm = z.infer<typeof signInForm>

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SingInForm>({
    resolver: zodResolver(signInForm),
  })

  async function handleSignIn(data: SingInForm) {
    console.log(data)

    try {
      const response = await api.post('sessions', data)
      const { token, refreshToken } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)

      toast.success('Login realizado com sucesso!')
    } catch (error) {
      toast.error('Email ou senha incorreto!')
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div>
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acesse o painel para fazer o acompanhamento dos seus alunos!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
