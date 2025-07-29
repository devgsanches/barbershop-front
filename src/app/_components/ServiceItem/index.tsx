import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import type { Service } from '@/app/page'

export function ServiceItem({ imageUrl, name, description, price }: Service) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="relative min-h-[6.875rem] min-w-[6.875rem]">
          <Image
            src={imageUrl}
            alt={name}
            height={110}
            width={110}
            sizes="110px"
            className="min-h-[6.875rem] min-w-[6.875rem] rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="space-y-2">
            <h3 className="text-sm font-bold">{name}</h3>
            <p className="text-[#838896]">{description}</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-primary">R$ {price},00</p>
              <Button variant="secondary" className="font-bold">
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
