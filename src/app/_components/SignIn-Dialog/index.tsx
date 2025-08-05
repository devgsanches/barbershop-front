'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Form } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import Image from 'next/image'

export function SigninDialog({
  isOpenLogin,
  setIsOpenLogin,
}: {
  isOpenLogin: boolean
  setIsOpenLogin: (isOpen: boolean) => void
}) {
  const [sucessLogin, setSucessLogin] = useState(false)
  const [sucessRegister, setSucessRegister] = useState(false)
  const [isOpenRegister, setIsOpenRegister] = useState(false)

  const { setUser } = useAuth()

  const router = useRouter()

  const formSchemaLogin = z.object({
    email: z.string().min(1, {
      message: 'Este campo é obrigatório.',
    }),
    password: z.string().min(1, {
      message: 'Este campo é obrigatório.',
    }),
  })

  const formSchemaRegister = z.object({
    name: z.string().min(1, {
      message: 'O nome é obrigatório.',
    }),
    email: z.string().min(1, {
      message: 'O email é obrigatório.',
    }),
    password: z.string().min(6, {
      message: 'A senha deve conter 6 ou mais caracteres.',
    }),
  })

  const formLogin = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const formRegister = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmitLogin = async (data: z.infer<typeof formSchemaLogin>) => {
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      })
      setSucessLogin(true)

      if (response.status === 200) {
        setTimeout(() => {
          setSucessLogin(false)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('token', response.data.token)
          setUser(response.data.user)
          router.push('/')
          formLogin.reset()
        }, 1000)
      }
    } catch (error) {
      console.error('Erro ao fazer login', error)
    }
  }

  const onSubmitRegister = async (data: z.infer<typeof formSchemaRegister>) => {
    try {
      await api.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      setSucessRegister(true)

      setTimeout(() => {
        setIsOpenRegister(false)
        formRegister.reset()
        setSucessRegister(false)
      }, 1000)
    } catch (error) {
      console.error('Erro ao fazer cadastro', error)
    }
  }

  async function handleSignInWithGoogle() {
    window.location.href = 'http://localhost:3333/auth/google'
  }
  return (
    <Dialog open={isOpenLogin} onOpenChange={() => setIsOpenLogin(false)}>
      <DialogContent className="max-w-[90%] rounded-lg">
        <DialogHeader>
          <DialogTitle>Faça login na plataforma</DialogTitle>
          <DialogDescription>
            Conecte-se com seu email e senha ou com sua conta do Google.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...formLogin}>
            <form
              onSubmit={formLogin.handleSubmit(onSubmitLogin)}
              className="space-y-2"
            >
              {/* EMAIL */}
              <FormField
                control={formLogin.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* PASSWORD */}
              <FormField
                control={formLogin.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira sua senha"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    {sucessLogin && (
                      <FormDescription className="text-xs text-green-500">
                        Usuário logado com sucesso!
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>

              <div className="py-1.5">
                <Separator />
              </div>
              <Button
                className="w-full gap-2"
                variant={'outline'}
                onClick={handleSignInWithGoogle}
                type="button"
              >
                <Image src="/google.svg" alt="Google" width={16} height={16} />
                Google
              </Button>
            </form>
          </Form>
          <p className="mt-2.5 flex justify-end gap-1 text-center text-xs font-bold text-gray-500">
            Não tem uma conta?{' '}
            <Dialog open={isOpenRegister}>
              <DialogTrigger onClick={() => setIsOpenRegister(true)}>
                <span className="text-end text-xs font-bold text-primary underline underline-offset-2">
                  Cadastre-se
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-[90%] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Realize seu cadastro</DialogTitle>
                  <DialogDescription>
                    Crie uma conta para{' '}
                    <span className="font-bold text-primary">continuar</span>.
                  </DialogDescription>
                </DialogHeader>
                <Form {...formRegister}>
                  <form
                    onSubmit={formRegister.handleSubmit(onSubmitRegister)}
                    className="space-y-2"
                  >
                    <FormField
                      control={formRegister.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-[#1A1B1F]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRegister.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-[#1A1B1F]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRegister.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-[#1A1B1F]"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!sucessRegister && (
                      <FormDescription className="text-xs">
                        Sua senha deve conter{' '}
                        <span className="font-bold">6 ou mais</span> caracteres.
                      </FormDescription>
                    )}
                    {sucessRegister && (
                      <FormDescription className="text-xs text-green-500">
                        Usuário cadastrado com sucesso!
                      </FormDescription>
                    )}
                    <div className="py-2">
                      <Button type="submit" className="w-full">
                        Cadastrar
                      </Button>
                    </div>
                    <div className="flex w-full justify-end">
                      <span
                        className="text-end text-xs font-bold text-primary underline underline-offset-2"
                        onClick={() => setIsOpenRegister(false)}
                      >
                        Já tem uma conta?
                      </span>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
