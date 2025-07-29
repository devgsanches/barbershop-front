'use client'

import { Input } from './_components/ui/input'
import { Header } from './_components/Header'
import { Button } from './_components/ui/button'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { Booking } from './_components/Booking'
import { BarbershopItem } from './_components/BarbershopItem'
import { searchOptions } from '../utils/search'
import { OptionItem } from './_components/OptionItem'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'

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
  name: string
  description: string
  price: number
  imageUrl: string
}

export default function Home() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([])
  const [popularBarbershops, setPopularBarbershops] = useState<Barbershop[]>([])

  async function fetchBarbershops() {
    const response = await api.get('/barbershop')

    setBarbershops(response.data)
  }

  useEffect(() => {
    fetchBarbershops()
    fetchPopularBarbershops()
  }, [])

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

  return (
    <div>
      <Header />
      <div className="py-6">
        <div className="flex flex-col gap-1 px-5">
          <h2 className="text-xl">
            Olá, <span className="font-bold">Guilherme Sanches!</span>
          </h2>
          <p className="text-sm font-normal">Sábado, 26 de Julho</p>
        </div>

        {/* SEARCH */}
        <div className="mt-6 flex items-center gap-2 px-5">
          <Input placeholder="Buscar" />
          <Button>
            <Search />
          </Button>
        </div>

        {/* FILTER OPTIONS */}
        <div className="mt-6 flex gap-2 overflow-x-auto pl-5 [&::-webkit-scrollbar]:hidden">
          {searchOptions.map((option) => {
            return (
              <OptionItem
                key={option.text}
                icon={option.icon}
                text={option.text}
              />
            )
          })}
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
        <Booking />

        {/* RECOMENDADOS */}
        <div className="mt-6 px-5">
          <h3 className="mb-3 font-nunito text-xs font-bold uppercase text-[#838896]">
            Recomendados
          </h3>
          <div className="flex gap-4 overflow-x-auto">
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

          <div className="flex gap-4 overflow-x-auto">
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem
                id={barbershop.id}
                key={barbershop.name}
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
