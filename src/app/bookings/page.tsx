'use client'

import { api } from '@/services/api'
import { Header } from '../_components/Header'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Booking } from '../_components/Booking'
import { format } from 'date-fns'
import type { Barbershop } from '../page'

type Booking = {
  id: string
  date: string
  barbershopService: {
    barbershopId: string
    name: string
    price: number
    date: string
  }
}

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [barbershops, setBarbershops] = useState<Barbershop[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return
      try {
        const response = await api.get(`/booking/${user.id}`)

        setBookings(response.data)
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      }
    }

    fetchBookings()
  }, [user])

  useEffect(() => {
    const fetchBarbershops = async () => {
      if (bookings.length === 0) return

      try {
        // Busca as barbearias únicas dos agendamentos
        const uniqueBarbershopIds = bookings
          .map((booking) => booking.barbershopService?.barbershopId)
          .filter((id): id is string => id !== undefined)
          .filter((id, index, array) => array.indexOf(id) === index) // Remove duplicatas

        // Carrega as barbearias em paralelo com Promise.allSettled para não falhar se uma falhar
        const barbershopPromises = uniqueBarbershopIds.map(
          async (barbershopId) => {
            try {
              const response = await api.get(`/barbershop/${barbershopId}`)
              return response.data
            } catch (error) {
              console.error(`Erro ao buscar barbearia ${barbershopId}:`, error)
              return null
            }
          },
        )

        const results = await Promise.allSettled(barbershopPromises)
        const barbershopData = results
          .filter(
            (result): result is PromiseFulfilledResult<Barbershop> =>
              result.status === 'fulfilled',
          )
          .map((result) => result.value)
          .filter((barbershop) => barbershop !== null)

        setBarbershops(barbershopData)
      } catch (error) {
        console.error('Erro ao buscar barbearias:', error)
      }
    }

    fetchBarbershops()
  }, [bookings])

  // Função para encontrar a barbearia pelo ID
  const findBarbershop = (barbershopId: string) => {
    return barbershops.find((barbershop) => barbershop.id === barbershopId)
  }

  return (
    <div>
      <Header />
      {/* TITLE */}
      <div className="pl-5 pt-6">
        <h1 className="text-xl font-bold capitalize">Agendamentos</h1>
      </div>

      {bookings.length > 0 ? (
        <>
          {/* CONFIRMED BOOKINGS */}
          <div>
            <h2 className="p-5 pb-3 pt-6 text-xs font-bold uppercase text-[#838896]">
              confirmados
            </h2>
            <div className="space-y-3">
              {bookings.map((booking) => {
                const bookingDate = new Date(booking.date)
                const today = new Date()
                const isFinished = bookingDate < today
                const barbershop = findBarbershop(
                  booking.barbershopService?.barbershopId || '',
                )

                if (!isFinished) {
                  return (
                    <Booking
                      key={booking.id}
                      booking={booking}
                      bookings={bookings}
                      setBookings={setBookings}
                      barbershop={barbershop || null}
                      date={format(bookingDate, 'dd/MM/yyyy')}
                      time={format(bookingDate, 'HH:mm')}
                    />
                  )
                }
                return null
              })}
            </div>
          </div>

          {/* FINISHED BOOKINGS */}
          <div>
            <div className="pb-12">
              {bookings.map((booking) => {
                const bookingDate = new Date(booking.date)
                const today = new Date()
                const isFinished = bookingDate < today
                const barbershop = findBarbershop(
                  booking.barbershopService?.barbershopId || '',
                )

                if (isFinished) {
                  return (
                    <div key={booking.id}>
                      <h2 className="p-5 pb-3 pt-6 text-xs font-bold uppercase text-[#838896]">
                        FINALIZADOS
                      </h2>
                      <Booking
                        booking={booking}
                        bookings={bookings}
                        setBookings={setBookings}
                        barbershop={barbershop || null}
                        date={format(bookingDate, 'dd/MM/yyyy')}
                        time={format(bookingDate, 'HH:mm')}
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="pt-6 text-center text-sm text-[#838896]">
          Nenhum agendamento concluído/finalizado.
        </p>
      )}
    </div>
  )
}
