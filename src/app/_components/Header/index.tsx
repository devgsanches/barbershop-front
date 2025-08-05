'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { Sheet, SheetTrigger } from '../ui/sheet'
import { SidebarSheet } from '../SidebarSheet'
import { Button } from '../ui/button'
import Link from 'next/link'

export const Header = () => {
  return (
    <div className="flex w-full items-center justify-between border-b px-5 py-[2.0625rem]">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="logo"
          width={130}
          height={22}
          sizes="100%"
        />
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button size={'icon'} variant={'secondary'}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SidebarSheet />
      </Sheet>
    </div>
  )
}
