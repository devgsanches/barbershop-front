import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../database/prisma'

// Middleware de autenticação
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('=== DEBUG AUTHENTICATION ===')
    console.log('Headers:', req.headers.authorization)

    // 1. Pega o token do header Authorization
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      console.log('❌ Token não fornecido')
      return res.status(401).json({
        message: 'Token de autenticação não fornecido',
      })
    }

    console.log('✅ Token recebido:', token.substring(0, 20) + '...')
    console.log(
      'JWT_SECRET:',
      process.env.JWT_SECRET ? 'DEFINIDO' : 'NÃO DEFINIDO',
    )

    // 2. Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    console.log('✅ Token decodificado:', decoded)

    // 3. Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    })

    if (!user) {
      console.log('❌ Usuário não encontrado no banco')
      return res.status(401).json({
        message: 'Usuário não encontrado',
      })
    }

    console.log('✅ Usuário autenticado:', user)
    // 4. Adiciona o usuário à requisição
    req.user = user
    next()
  } catch (error) {
    console.error('❌ Erro na autenticação:', error)
    return res.status(403).json({
      message: 'Token inválido ou expirado',
    })
  }
}
