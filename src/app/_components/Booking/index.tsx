import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Badge } from '../ui/badge'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Barbershop } from '@/app/page'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
  SheetDescription,
  SheetHeader,
} from '../ui/sheet'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { PhoneItem } from '../PhoneItem'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog'
import { formatCurrency } from '@/utils/formatCurrency'
import { api } from '@/services/api'
import type { BarbershopService } from '../ServiceItem'

interface IBooking {
  id: string
  date: string
  barbershopService: {
    barbershopId: string
    name: string
    price: number
    date: string
  }
}

type BookingProps = {
  barbershop: Barbershop | null
  date: string
  time: string
  booking?:
    | IBooking
    | {
        barbershopService?: BarbershopService
        id: string
        date: string
        barbershopServiceId: string
        userId: string
      }
  bookings?: IBooking[]
  setBookings?: (bookings: IBooking[]) => void
}

export const Booking = ({
  barbershop,
  date,
  time,
  booking,
  bookings,
  setBookings,
}: BookingProps) => {
  // Converte a data para exibir mês e dia
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date())
  const month = format(parsedDate, 'MMMM', { locale: ptBR })
  const day = format(parsedDate, 'dd')

  // Determina se o agendamento é confirmado ou finalizado baseado na data, hora e minutos
  const today = new Date()
  const bookingDate = parse(date, 'dd/MM/yyyy', new Date())

  // Adiciona a hora e minutos ao bookingDate
  const [hours, minutes] = time.split(':').map(Number)
  bookingDate.setHours(hours, minutes, 0, 0)

  const isFinished = bookingDate < today
  const status = isFinished ? 'finalizado' : 'confirmado'

  // Gera iniciais para o fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleRemoveBooking = async (bookingId: string) => {
    try {
      if (!bookings || !setBookings) return
      await api.delete(`/booking/${bookingId}`)
      setBookings(bookings.filter((booking) => booking.id !== bookingId))
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <div className="flex w-full flex-col gap-3 px-5">
          <div className="flex justify-between rounded-lg border border-[#26272B] bg-[#1A1B1F] pl-3">
            <div className="flex flex-col py-3">
              <Badge
                className={`mb-3 w-fit capitalize`}
                variant={status === 'finalizado' ? 'secondary' : 'default'}
              >
                {status === 'confirmado' ? 'confirmado' : 'finalizado'}
              </Badge>
              <div className="flex flex-col gap-2">
                <h3 className="text-left font-bold">
                  {booking?.barbershopService?.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 rounded-full">
                    <AvatarImage
                      src={barbershop?.imageUrl || ''}
                      alt={barbershop?.name || 'Barbearia'}
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                    />
                    <AvatarFallback className="bg-gray-600 text-xs text-white">
                      {barbershop?.name ? getInitials(barbershop.name) : 'BB'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{barbershop?.name || 'Barbearia'}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-l px-7 py-6">
              <p className="text-xs capitalize">{month}</p>
              <p className="text-2xl">{day}</p>
              <p className="text-xs">{time}</p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-[85%] flex-col px-5">
        <SheetHeader className="text-left">
          <SheetTitle className="">Informações da Reserva</SheetTitle>
          <SheetDescription>Veja os detalhes da reserva.</SheetDescription>
        </SheetHeader>
        <div className="relative mt-6 h-[11.25rem] w-full rounded-lg">
          <Image
            src="/map.png"
            alt={barbershop?.name || 'Barbearia'}
            fill
            className="rounded-lg object-cover"
          />
          <Card className="absolute bottom-4 left-5 right-5">
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-12 w-12 rounded-3xl">
                <AvatarImage
                  src={barbershop?.imageUrl || ''}
                  alt={barbershop?.name || 'Barbearia'}
                  className="h-full w-full rounded-3xl object-cover"
                />
                <AvatarFallback className="h-full w-full">
                  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-blue-950 text-xs text-white">
                    {barbershop?.name
                      ?.split(' ')
                      .map((word) => word.charAt(0))
                      .join('')
                      .toUpperCase()}
                  </div>
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{barbershop?.name}</p>
                <span className="text-xs text-white">
                  {barbershop?.address}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BADGE AND INFORMATIONS */}
        <div className="mt-6 flex flex-col gap-3">
          <div>
            <Badge className="default">
              <p className="capitalize">confirmado</p>
            </Badge>
          </div>
          <Card>
            <CardContent className="space-y-3 p-3">
              <div className="flex justify-between font-semibold">
                <p>{booking?.barbershopService?.name}</p>{' '}
                <p>{formatCurrency(booking?.barbershopService?.price || 0)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#838896]">Data</p>
                <p>
                  {booking?.date
                    ? format(new Date(booking.date), "dd 'de' MMMM", {
                        locale: ptBR,
                      })
                    : '--'}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#838896]">Horário</p>{' '}
                <p>
                  {booking?.date
                    ? format(new Date(booking.date), 'HH:mm')
                    : '--:--'}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#838896]">Barbearia</p>
                <p>{barbershop?.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PHONE NUMBERS */}
        <div className="mt-6 space-y-3">
          {barbershop?.phones.map((phone, i) => (
            <PhoneItem key={i} phone={phone} />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-1 flex-col justify-end gap-3">
          <SheetClose asChild>
            <Button variant={'secondary'} className="w-full font-bold">
              Voltar
            </Button>
          </SheetClose>

          {status === 'finalizado' ? null : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'destructive'} className="w-full font-bold">
                  Cancelar Reserva
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] rounded-lg">
                <DialogTitle className="text-center">
                  Cancelar Reserva
                </DialogTitle>
                <DialogDescription className="text-center">
                  Tem certeza que deseja cancelar esse agendamento?
                </DialogDescription>
                <div className="flex gap-3">
                  <DialogClose asChild>
                    <Button
                      variant={'secondary'}
                      className="w-full rounded-lg font-bold"
                    >
                      Voltar
                    </Button>
                  </DialogClose>
                  <Button
                    variant={'destructive'}
                    className="w-full rounded-lg font-bold"
                    onClick={() => handleRemoveBooking(booking?.id || '')}
                  >
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
