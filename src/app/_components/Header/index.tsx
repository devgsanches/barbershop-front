import { CalendarRange, HouseIcon, LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { searchOptions } from '@/utils/search'
import Link from 'next/link'

export const Header = () => {
  return (
    <div className="flex w-full items-center justify-between border-b px-5 py-[2.0625rem]">
      <Image src="/logo.svg" alt="logo" width={130} height={22} sizes="100%" />
      <Sheet>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription></SheetDescription>
          <div className="flex items-center gap-3 border-b py-6">
            <Avatar>
              <AvatarImage src="https://github.com/devgsanches.png" />
            </Avatar>
            <div>
              <p className="font-bold">Guilherme Sanches</p>
              <p className="text-xs">guilherme.sanches@flapper.aero</p>
            </div>
          </div>
          {/* MAIN OPTIONS */}
          <div className="flex flex-col gap-2 border-b py-6">
            <SheetClose asChild>
              <Button
                variant={'ghost'}
                className="flex items-center justify-start gap-3 text-sm hover:bg-[#8162FF] hover:text-white"
                asChild
              >
                <Link href="/">
                  {' '}
                  <HouseIcon size={16} />
                  Ínicio
                </Link>
              </Button>
            </SheetClose>
            <Button
              variant={'ghost'}
              className="flex items-center justify-start gap-3 text-sm hover:bg-[#8162FF] hover:text-white"
            >
              <CalendarRange size={16} />
              Agendamentos
            </Button>
          </div>
          {/* GENERAL OPTIONS */}
          <div className="flex flex-col gap-2 border-b py-6">
            {searchOptions.map((option, i) => {
              return (
                <Button
                  variant={'ghost'}
                  className="flex items-center justify-start gap-3 text-sm hover:bg-[#8162FF] hover:text-white"
                  key={i}
                >
                  <Image src={option.icon} alt={option.text} />
                  {option.text}
                </Button>
              )
            })}
          </div>

          {/* SIGNOUT */}
          <div className="py-6">
            <Button
              className="flex w-full items-center justify-start gap-3 hover:bg-[#8162FF] hover:text-white"
              variant={'ghost'}
            >
              <LogOut />
              Sair da conta
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
