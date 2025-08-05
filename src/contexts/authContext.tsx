import { createContext } from 'react'

interface User {
  id: string
  name: string
  email: string
  imageUrl: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})
