'use client'

import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import type { Barbershop, Service } from '@/app/page'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import { Calendar } from '../ui/calendar'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog'
import { CalendarCheck } from 'lucide-react'
import { SigninDialog } from '../SignIn-Dialog'

export type BarbershopService = {
  id: string
  barbershopId: string
  name: string
  price: number
  imageUrl: string
}

export type Booking = {
  barbershopService?: BarbershopService
  id: string
  date: string
  barbershopServiceId: string
  userId: string
}

export function ServiceItem({
  service,
  barbershop,
}: {
  service: Service
  barbershop: Barbershop
}) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [onReservationOpen, setOnReservationOpen] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)

  const handleReservation = () => {
    if (!user) {
      setIsOpenLogin(true)
      return
    }
    setOnReservationOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const TIME_LIST = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ]

  const availableTimes = (bookings: Booking[]) => {
    return TIME_LIST.filter((time) => {
      const [hour, minutes] = time.split(':').map(Number)

      // Verifica se já existe agendamento neste horário
      const hasBookingOnCurrentTime = bookings.some((booking) => {
        // Cria a data do horário selecionado para comparação
        const timeToCheck = new Date(selectedDay!)
        timeToCheck.setHours(hour, minutes, 0, 0)

        // Converte a data do booking para horário local
        const bookingDate = new Date(booking.date)

        // Compara horários locais
        const isSameTime =
          bookingDate.getHours() === hour &&
          bookingDate.getMinutes() === minutes &&
          bookingDate.getDate() === selectedDay!.getDate()

        return isSameTime
      })

      // Verifica se o horário já passou (para hoje)
      if (selectedDay) {
        const today = new Date()
        const isToday = selectedDay.toDateString() === today.toDateString()

        if (isToday) {
          const currentHour = today.getHours()
          const currentMinute = today.getMinutes()

          if (
            hour < currentHour ||
            (hour === currentHour && minutes <= currentMinute)
          ) {
            return false
          }
        }
      }

      return !hasBookingOnCurrentTime
    })
  }

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return

    // Cria a data em horário local
    const localDate = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate(),
      Number(selectedTime?.split(':')[0]),
      Number(selectedTime?.split(':')[1]),
    )

    return localDate
  }, [selectedDay, selectedTime])

  async function handleCreateBooking() {
    if (!user || !selectedDate) {
      return toast.error('Faça login para realizar uma reserva.')
    }

    try {
      setIsLoading(true)
      await api.post('/booking', {
        barbershopServiceId: service.id,
        userId: user.id,
        date: selectedDate.toISOString(), // Envia como ISO para o backend
      })
      setBookingSuccess(true)

      if (selectedDay) {
        const response = await api.get('/booking', {
          params: {
            serviceId: service.id,
            date: selectedDay.toISOString(),
          },
        })
        setDayBookings(response.data)
      }

      toast.success('Reserva realizada com sucesso!')
    } catch (error: unknown) {
      console.error(error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } }
        }
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message)
        } else {
          toast.error('Erro ao realizar reserva. Tente novamente mais tarde.')
        }
      } else {
        toast.error('Erro ao realizar reserva. Tente novamente mais tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function getTimes() {
      if (!selectedDay) {
        setDayBookings([])
        return
      }

      try {
        const response = await api.get('/booking', {
          params: {
            serviceId: service.id,
            date: selectedDay.toISOString(),
          },
        })

        setDayBookings(response.data)
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
        setDayBookings([])
      }
    }
    getTimes()
  }, [selectedDay, service.id])

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="relative min-h-[6.875rem] min-w-[6.875rem]">
          <Image
            src={service.imageUrl}
            alt={service.name}
            height={110}
            width={110}
            sizes="110px"
            className="min-h-[6.875rem] min-w-[6.875rem] rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="space-y-2">
            <h3 className="text-sm font-bold">{service.name}</h3>
            <p className="text-[#838896]">{service.description}</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-primary">R$ {service.price},00</p>

              <Button
                variant="secondary"
                className="font-bold"
                onClick={handleReservation}
              >
                Reservar
              </Button>
              {user ? (
                <Sheet
                  open={onReservationOpen}
                  onOpenChange={() => setOnReservationOpen(false)}
                >
                  <SheetContent className="min-w-[23.125rem] overflow-y-scroll px-0 [&::-webkit-scrollbar]:hidden">
                    <SheetHeader>
                      <SheetTitle>
                        <div className="flex justify-start border-b p-5">
                          <h2>Fazer reserva</h2>
                        </div>
                      </SheetTitle>
                      <SheetDescription></SheetDescription>
                    </SheetHeader>
                    <div className="flex border-b px-1 py-0">
                      <Calendar
                        mode="single"
                        locale={ptBR}
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        disabled={{ before: new Date() }}
                        className="flex-1"
                        styles={{
                          head_cell: {
                            width: '100%',
                            textTransform: 'capitalize',
                          },
                          month: {
                            textTransform: 'capitalize',
                          },
                          cell: {
                            width: '100%',
                          },
                          button: {
                            width: '100%',
                          },
                          nav_button_previous: {
                            width: '32px',
                            height: '32px',
                          },
                          nav_button_next: {
                            width: '32px',
                            height: '32px',
                          },
                          caption: {
                            textTransform: 'capitalize',
                          },
                          day_button: {
                            borderRadius: '2rem',
                          },
                        }}
                      />
                    </div>
                    {selectedDay && (
                      <div className="flex gap-3 overflow-x-scroll border-b p-5 [&::-webkit-scrollbar]:hidden">
                        {availableTimes(dayBookings).map((time) => {
                          return (
                            <Button
                              key={time}
                              variant={`${selectedTime === time ? 'default' : 'outline'}`}
                              className="rounded-full"
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          )
                        })}
                      </div>
                    )}

                    {selectedDay && selectedTime && (
                      <div className="p-5">
                        <Card>
                          <CardContent className="space-y-3 p-3">
                            <div className="flex justify-between">
                              <p>{service.name}</p>{' '}
                              <p>{formatCurrency(service.price)}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-[#838896]">Data</p>
                              <p>
                                {format(selectedDay, "dd 'de' MMMM", {
                                  locale: ptBR,
                                })}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-[#838896]">Horário</p>{' '}
                              <p>{selectedTime}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-[#838896]">Barbearia</p>
                              <p>{barbershop.name}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {selectedDay && selectedTime && (
                      <div className="px-5">
                        <Dialog
                          open={bookingSuccess}
                          onOpenChange={() => setBookingSuccess(false)}
                        >
                          <Button
                            className="w-full"
                            onClick={handleCreateBooking}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Confirmando...' : 'Confirmar'}
                          </Button>

                          {bookingSuccess && (
                            <DialogContent className="max-w-[15.375rem] rounded-lg pt-0">
                              <DialogTitle></DialogTitle>
                              <DialogDescription></DialogDescription>
                              <div className="flex flex-col items-center">
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                                  <CalendarCheck color="#141518" size={32} />
                                </div>
                                <div className="flex flex-col items-center gap-2 pt-5">
                                  <h2 className="font-bold">
                                    Reserva Efetuada!
                                  </h2>
                                  <p className="text-center text-sm text-[#838896]">
                                    Sua reserva foi agendada com sucesso.
                                  </p>
                                </div>
                                <div className="flex w-full pt-5">
                                  <DialogClose asChild>
                                    <Button
                                      variant="secondary"
                                      className="flex-1"
                                      onClick={() => {
                                        setBookingSuccess(false)
                                        setSelectedDay(undefined)
                                        setSelectedTime(undefined)
                                      }}
                                    >
                                      Confirmar
                                    </Button>
                                  </DialogClose>
                                </div>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              ) : (
                <SigninDialog
                  isOpenLogin={isOpenLogin}
                  setIsOpenLogin={setIsOpenLogin}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
