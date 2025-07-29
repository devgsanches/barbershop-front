'use client'

import { PhoneItem } from '@/app/_components/PhoneItem'
import { ServiceItem } from '@/app/_components/ServiceItem'
import type { Barbershop } from '@/app/page'
import { api } from '@/services/api'
import { Map, Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'

export default function BarbershopPage({ params }: { params: { id: string } }) {
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null)

  const fetchBarbershops = useCallback(async () => {
    const response = await api.get(`barbershop/${params.id}`)

    setBarbershop(response.data)
  }, [params.id])

  useEffect(() => {
    fetchBarbershops()
  }, [fetchBarbershops])

  if (!barbershop) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-lg text-primary">
        Carregando..
      </div>
    )
  }

  return (
    <div>
      <div className="relative min-h-[15.625rem] min-w-[24.375rem]">
        {/* IMAGE */}
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          width={390}
          height={250}
          sizes="(max-width: 768px) 100vw, 390px"
          className="min-h-[15.625rem] min-w-[24.375rem] object-cover"
          priority
        />
      </div>

      {/* TITLE */}
      <div>
        <h2 className="px-5 pt-4 text-xl font-bold">{barbershop.name}</h2>
        <div className="border-b p-5 pt-3">
          <div className="flex items-center gap-2.5">
            <Map color="#8162FF" size={16} />{' '}
            <p className="text-sm">{barbershop.address}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Star color="#8162FF" size={16} fill="#8162FF" />
            <p className="text-sm">5,0 (889 avaliações)</p>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="border-b">
        <h3 className="p-5 pb-0 text-xs font-bold uppercase text-[#838896]">
          sobre nós
        </h3>
        <div className="p-5">
          <p className="text-justify text-sm">{barbershop.description}</p>
        </div>
      </div>

      {/* SERVICES */}
      <div className="border-b">
        <h3 className="p-5 pb-0 text-xs font-bold uppercase text-[#838896]">
          serviços
        </h3>
        <div className="space-y-3 p-5">
          {barbershop.services.map((service) => (
            <ServiceItem
              key={service.name}
              imageUrl={service.imageUrl}
              name={service.name}
              description={service.description}
              price={service.price}
            />
          ))}
        </div>
      </div>

      {/* PHONES */}
      <div className="border-b">
        <h3 className="p-5 pb-0 text-xs font-bold uppercase text-[#838896]">
          contato
        </h3>
        <div className="space-y-3 p-5">
          {barbershop.phones.map((phone, index) => (
            <PhoneItem key={index} phone={phone} />
          ))}
        </div>
      </div>
    </div>
  )
}
