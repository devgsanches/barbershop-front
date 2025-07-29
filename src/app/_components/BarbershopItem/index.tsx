import Image from 'next/image'
import { Button } from '../ui/button'

import { Card, CardContent } from '../ui/card'
import Link from 'next/link'

interface BarbershopItemProps {
  id: string
  name: string
  address: string
  imageUrl: string
}

export const BarbershopItem = ({
  id,
  name,
  address,
  imageUrl,
}: BarbershopItemProps) => {
  return (
    <Card className="max-w-[10.4375rem] p-1">
      <CardContent className="relative w-full p-0">
        <Image
          src={imageUrl}
          alt={`Barbearia ${name}`}
          width={159}
          height={159}
          sizes="159px"
          className="min-h-[9.9375rem] min-w-[9.9375rem] rounded-lg object-cover"
        />
        <div className="flex flex-col gap-1 px-3 pt-2">
          <h3 className="truncate font-bold">{name}</h3>
          <p className="truncate text-sm text-[#838896]">{address}</p>
        </div>
        <div className="px-3">
          <Button
            variant={'secondary'}
            className="my-2.5 w-full font-bold"
            asChild
          >
            <Link href={`/barbershop/${id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
