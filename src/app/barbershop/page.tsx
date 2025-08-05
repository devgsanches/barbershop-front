'use client'

import { useEffect, useState } from 'react'
import { Header } from '../_components/Header'
import { Search } from '../_components/Search'
import { api } from '@/services/api'
import { BarbershopItem } from '../_components/BarbershopItem'

interface BarbershopSearchPageProps {
  searchParams: {
    search: string
    service: string
  }
}

export interface Barbershops {
  id: string
  name: string
  address: string
  description: string
  imageUrl: string
  phones: string[]
}

export default function BarbershopSearchPage({
  searchParams,
}: BarbershopSearchPageProps) {
  const [barbershops, setBarbershops] = useState<Barbershops[]>([])

  useEffect(() => {
    const fetchBarbershops = async () => {
      if (searchParams.search) {
        const response = await api.get(
          `/barbershop?search=${searchParams.search}`,
        )
        setBarbershops(response.data)
      } else if (searchParams.service) {
        const response = await api.get(
          `/barbershop?service=${searchParams.service}`,
        )
        setBarbershops(response.data)
      }
    }

    fetchBarbershops()
  }, [searchParams])
  return (
    <>
      <Header />
      <div className="mt-6">
        <Search value={searchParams} />
      </div>
      <h2 className="mb-3 mt-6 px-5 font-nunito text-xs font-bold uppercase text-[#838896]">
        Resultados para{' '}
        {searchParams.search
          ? `"${searchParams.search}"`
          : `"${searchParams.service}"`}
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4 px-5 pb-12">
        {barbershops.map((barbershop) => (
          <BarbershopItem
            key={barbershop.id}
            id={barbershop.id}
            name={barbershop.name}
            address={barbershop.address}
            imageUrl={barbershop.imageUrl}
          />
        ))}
      </div>
    </>
  )
}
