'use client'

import { Smartphone } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export function PhoneItem({ phone }: { phone: string }) {
  function onHandleClick(phone: string) {
    navigator.clipboard.writeText(phone)
    toast.success('Telefone copiado com sucesso!')
  }
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2.5">
        <Smartphone />
        <p className="text-sm">{phone}</p>
      </div>
      <Button variant={'outline'} onClick={() => onHandleClick(phone)}>
        Copiar
      </Button>
    </div>
  )
}
