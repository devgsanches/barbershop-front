'use client'

import { AuthContext } from '@/contexts/authContext'
import { api } from '@/services/api'
import { useState, useEffect, useCallback } from 'react'
import { AxiosError } from 'axios'

interface User {
  id: string
  name: string
  email: string
  imageUrl: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Carrega o usuário do localStorage se existir
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }

        // Opcional: Tenta verificar se o usuário ainda está válido no servidor
        // Mas não falha se não conseguir
        if (typeof window !== 'undefined' && localStorage.getItem('user')) {
          try {
            const response = await api.get('/profile')
            const updatedUser = response.data

            // Só atualiza se receber dados válidos
            if (updatedUser && updatedUser.id) {
              setUser(updatedUser)
              // Atualiza localStorage com dados mais recentes
              localStorage.setItem('user', JSON.stringify(updatedUser))
            }
          } catch (apiError) {
            const err = apiError as AxiosError
            if (err.response?.status === 401) {
              // Usuário não está mais autenticado no servidor
              setUser(null)
              localStorage.removeItem('user')
            } else {
              // Erro de rede ou servidor, mas mantém o usuário do localStorage
              console.warn('Erro ao verificar perfil:', err.message)
              // Não limpa o usuário em caso de erro de rede
            }
          }
        }
      } catch (error) {
        console.error('Erro inesperado:', error)
        // Só limpa em caso de erro realmente crítico
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Função para atualizar o usuário (útil para login/logout)
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser)
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('user')
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-primary">Carregando...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
