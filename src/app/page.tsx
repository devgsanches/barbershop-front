'use client'

import { Header } from './_components/Header'
import { Search } from './_components/Search'
import Image from 'next/image'
import { Booking } from './_components/Booking'
import { BarbershopItem } from './_components/BarbershopItem'
import { searchOptions } from '../utils/search'
import { OptionItem } from './_components/OptionItem'
import { api } from '@/services/api'
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Booking as IBooking } from './_components/ServiceItem'
import { ptBR } from 'date-fns/locale'

export interface Barbershop {
  id: string
  name: string
  address: string
  description: string
  imageUrl: string
  phones: string[]
  services: Service[]
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

export default function Home() {
  const { user } = useAuth()
  const [barbershops, setBarbershops] = useState<Barbershop[]>([])
  const [popularBarbershops, setPopularBarbershops] = useState<Barbershop[]>([])
  const [latestBooking, setLatestBooking] = useState<IBooking | null>(null)
  const [latestBarbershop, setLatestBarbershop] = useState<Barbershop | null>(
    null,
  )

  async function fetchBarbershops() {
    const response = await api.get('/barbershop')
    setBarbershops(response.data)
  }

  const fetchLatestBooking = useCallback(async () => {
    if (!user) return

    try {
      const response = await api.get(`/booking/${user.id}`)
      const bookings = response.data

      if (bookings.length > 0) {
        const today = new Date()

        // Filtra apenas agendamentos confirmados (futuros)
        const confirmedBookings = bookings.filter((booking: IBooking) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= today // Agendamentos futuros ou hoje
        })

        if (confirmedBookings.length > 0) {
          // Encontra o agendamento confirmado mais recente (data mais próxima)
          const sortedBookings = confirmedBookings.sort(
            (a: IBooking, b: IBooking) => {
              const dateA = new Date(a.date)
              const dateB = new Date(b.date)
              return dateA.getTime() - dateB.getTime()
            },
          )

          const mostRecent = sortedBookings[0]
          setLatestBooking(mostRecent)

          // Busca informações da barbearia
          if (mostRecent.barbershopService?.barbershopId) {
            const barbershopResponse = await api.get(
              `/barbershop/${mostRecent.barbershopService.barbershopId}`,
            )
            setLatestBarbershop(barbershopResponse.data)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar agendamento mais recente:', error)
    }
  }, [user])

  useEffect(() => {
    fetchBarbershops()
    fetchPopularBarbershops()
    fetchLatestBooking()
  }, [fetchLatestBooking])

  async function fetchPopularBarbershops() {
    const response = await api.get('/barbershop')

    const barbershops = response.data

    const popularBarbershops = barbershops.reduce(
      (acc: Barbershop[], barbershop: Barbershop, index: number) => {
        if (index >= 3) {
          if (acc.length === 3) {
            return acc
          }
          acc.push(barbershop)
        }

        return acc
      },
      [],
    )

    setPopularBarbershops(popularBarbershops)
  }

  const date = new Date()

  const dayOfWeek = format(date, 'EEEE', {
    locale: ptBR,
  })

  const month = format(date, 'MMMM', {
    locale: ptBR,
  })

  return (
    <div>
      <Header />
      <div className="py-6">
        <div className="flex flex-col gap-1 px-5">
          <h2 className="text-xl">
            Olá,{' '}
            <span className="font-bold">
              {user ? user.name + '!' : 'Faça seu login!'}
            </span>
          </h2>
          <p className="text-sm font-normal capitalize">
            {dayOfWeek}
            <span className="normal-case">
              ,&nbsp;
              {date.getDate()} de&nbsp;
              <span className="capitalize">{month}</span>
            </span>
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-6">
          <Search />
        </div>

        {/* FILTER OPTIONS */}
        <div className="flex w-full justify-center">
          <div className="mt-6 flex max-w-[90%] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {searchOptions.map((option) => {
              return (
                <Link
                  href={`/barbershop?service=${option.text}`}
                  key={option.text}
                >
                  <OptionItem icon={option.icon} text={option.text} />
                </Link>
              )
            })}
          </div>
        </div>

        {/* BANNER */}
        <div className="relative mt-6 h-[9.375rem]">
          <Image
            src="/banner-01.svg"
            alt="Banner"
            fill
            sizes="100%"
            className="rounded-lg object-cover px-5"
            priority
          />
        </div>

        {/* AGENDAMENTOS */}
        {latestBooking && latestBarbershop && (
          <>
            <div className="mb-3 mt-6 flex flex-col px-5">
              <h3 className="font-nunito text-xs font-bold uppercase text-[#838896]">
                Agendamentos
              </h3>
            </div>
            <Booking
              booking={latestBooking}
              barbershop={latestBarbershop}
              date={format(new Date(latestBooking.date), 'dd/MM/yyyy')}
              time={format(new Date(latestBooking.date), 'HH:mm')}
            />
          </>
        )}

        {/* RECOMENDADOS */}
        <div className="mt-6 px-5">
          <h3 className="mb-3 font-nunito text-xs font-bold uppercase text-[#838896]">
            Recomendados
          </h3>
          <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => {
              return (
                <BarbershopItem
                  key={barbershop.name}
                  id={barbershop.id}
                  name={barbershop.name}
                  address={barbershop.address}
                  imageUrl={barbershop.imageUrl}
                />
              )
            })}
          </div>
        </div>

        {/* POPULARES */}
        <div className="mt-6 flex flex-col gap-3 px-5">
          <h3 className="font-nunito text-xs font-bold uppercase text-[#838896]">
            Populares
          </h3>

          <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem
                key={barbershop.id}
                id={barbershop.id}
                name={barbershop.name}
                address={barbershop.address}
                imageUrl={barbershop.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
