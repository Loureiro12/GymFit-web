import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

const signUpForm = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const [term, setTerm] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  })

  async function handleSignIn(data: SignUpForm) {
    if (!term) {
      toast.error('Para prosseguir, é necessário aceitar os termos de serviço.')
      return
    }

    console.log(data)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success('Cadastro realizado com sucesso!')
  }
  return (
    <>
      <Helmet title="Login" />
      <div>
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Crie sua conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe de perto seus alunos, potencializando o melhor em cada
              um deles!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Nome"
                {...register('firstName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Sobrenome"
                {...register('lastName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                {...register('password')}
              />
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox id="term" name="term" onClick={() => setTerm(!term)} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="term"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ao me inscrever, aceito os Termos de Serviço do GymFit e
                  reconheço a Política de Privacidade.
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
