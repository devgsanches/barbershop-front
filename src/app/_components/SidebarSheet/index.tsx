'use client'

import { CalendarRange, HouseIcon, LogIn, LogOut } from 'lucide-react'
import Image from 'next/image'
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { searchOptions } from '@/utils/search'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { useState, useEffect } from 'react'
import { SigninDialog } from '../SignIn-Dialog'
export function SidebarSheet() {
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false)
  const { user, setUser } = useAuth()
  const router = useRouter()

  // Verifica se o usuário voltou do login com Google
  useEffect(() => {
    let isChecking = false

    const checkGoogleLogin = async () => {
      if (isChecking) return // Evita chamadas simultâneas

      // Se já tem usuário no localStorage, não precisa verificar
      if (localStorage.getItem('user')) {
        return
      }

      try {
        isChecking = true
        // Verifica se há um usuário logado no servidor
        const response = await api.get('/profile')
        if (response.data && response.data.id) {
          setUser(response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
          // Para login com Google, o token pode estar em um cookie ou sessão
          // Se o backend retornar um token, salve-o também
          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
          }
        }
      } catch {
        // Usuário não está logado ou erro de rede
        console.log('Usuário não está logado via Google')
      } finally {
        isChecking = false
      }
    }

    // Verifica se há token na URL (retorno do Google OAuth)
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl)
      // Remove o token da URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Executa a verificação quando o componente monta
    checkGoogleLogin()

    // Verifica periodicamente (a cada 2 segundos) por 10 segundos
    const interval = setInterval(checkGoogleLogin, 2000)
    const timeout = setTimeout(() => clearInterval(interval), 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [setUser]) // Adicionada a dependência setUser de volta

  const handleSignOut = async () => {
    try {
      await api.get('/logout', { withCredentials: true })
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout', error)
    }
  }

  function handleAvatarInitials(name: string) {
    const initials = name
      .split(' ')
      .map((i) => i[0])
      .join('')

    return initials
  }

  return (
    <SheetContent>
      <SheetTitle>Menu</SheetTitle>
      <SheetDescription></SheetDescription>
      <div className="flex items-center gap-3 border-b py-6">
        {user && user.imageUrl ? (
          <>
            <Avatar className="border-2 border-[#8162FF]">
              <AvatarImage src={user.imageUrl} />
            </Avatar>
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-xs">{user.email}</p>
            </div>{' '}
          </>
        ) : user && !user.imageUrl ? (
          <>
            <Avatar className="border-2 border-[#8162FF]">
              <AvatarFallback>{handleAvatarInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-xs">{user.email}</p>
            </div>{' '}
          </>
        ) : (
          <div className="flex w-full items-center justify-between">
            <h2 className="font-bold">Olá, Faça seu login!</h2>

            <Button
              variant={'default'}
              size={'icon'}
              onClick={() => setIsOpenLogin(true)}
            >
              <LogIn />
            </Button>

            <SigninDialog
              isOpenLogin={isOpenLogin}
              setIsOpenLogin={setIsOpenLogin}
            />
          </div>
        )}
      </div>
      {/* MAIN OPTIONS */}
      <div className="flex flex-col gap-2 border-b py-6">
        <SheetClose asChild>
          <Button
            variant={'ghost'}
            className="flex items-center justify-start gap-3 text-sm hover:bg-[#8162FF] hover:text-white"
            asChild
          >
            <Link href="/">
              {' '}
              <HouseIcon size={16} />
              Ínicio
            </Link>
          </Button>
        </SheetClose>

        <Button
          variant={'ghost'}
          className="flex w-full items-center justify-start gap-3 text-sm hover:bg-[#8162FF] hover:text-white"
          asChild
        >
          <Link href="/bookings">
            <CalendarRange size={16} />
            Agendamentos
          </Link>
        </Button>
      </div>
      {/* GENERAL OPTIONS */}
      <div className="flex flex-col gap-2 border-b py-6">
        {searchOptions.map((option, i) => {
          return (
            <SheetClose asChild key={i}>
              <Button
                variant={'ghost'}
                className="flex items-center justify-start gap-3 text-sm hover:bg-[#8162FF] hover:text-white"
                asChild
              >
                <Link href={`/barbershop?service=${option.text}`}>
                  {' '}
                  <Image src={option.icon} alt={option.text} />
                  {option.text}
                </Link>
              </Button>
            </SheetClose>
          )
        })}
      </div>

      {/* SIGNOUT */}
      {user && (
        <div className="py-6">
          <Button
            className="flex w-full items-center justify-start gap-3 hover:bg-[#8162FF] hover:text-white"
            variant={'ghost'}
            onClick={handleSignOut}
          >
            <LogOut />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}
