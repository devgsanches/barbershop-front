import { Router } from 'express'
import { BookingController } from '../controllers/bookingController'
import { authenticateToken } from '../middlewares/auth'

export const bookingRouter = Router()
const bookingController = new BookingController()

// Buscar agendamentos (GET /booking)
bookingRouter.get('/', bookingController.show)

// Criar agendamento (POST /booking)
bookingRouter.post('/', authenticateToken, bookingController.store)
