import Image from 'next/image'
import { Card, CardContent } from '../ui/card'

interface OptionItemProps {
  icon: string
  text: string
}

export function OptionItem({ icon, text }: OptionItemProps) {
  return (
    <Card className="flex items-center justify-center p-0">
      <CardContent className="flex h-full items-center justify-center gap-2.5 px-4 py-3">
        <Image src={icon} alt={text} sizes="100%" />
        <p className="text-sm font-semibold">{text}</p>
      </CardContent>
    </Card>
  )
}
