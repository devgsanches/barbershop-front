import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from '../ui/badge'

export const Booking = () => {
  return (
    <div className="mt-6 flex flex-col gap-3 px-5">
      <h3 className="font-nunito text-xs font-bold uppercase text-[#838896]">
        Agendamentos
      </h3>

      <div className="flex justify-between rounded-lg border border-[#26272B] bg-[#1A1B1F] pl-3">
        <div className="flex flex-col py-3">
          <Badge className="mb-3 w-fit bg-[#221C3D] font-bold text-[#8162FF]">
            Confirmado
          </Badge>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Corte de Cabelo</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 rounded-full">
                <AvatarImage src="/img-barbearia.jpg" />
              </Avatar>
              <p className="text-sm">Vintage Barber</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l px-7 py-6">
          <p className="text-xs">Julho</p>
          <p className="text-2xl">26</p>
          <p className="text-xs">09:45</p>
        </div>
      </div>
    </div>
  )
}
