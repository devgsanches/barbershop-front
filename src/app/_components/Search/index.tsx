'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormMessage } from '../ui/form'
import { FormField } from '../ui/form'
import { useEffect } from 'react'

export const Search = ({
  value,
}: {
  value?: {
    search: string
    service: string
  }
}) => {
  const router = useRouter()

  const formSchema = z.object({
    search: z.string().min(1, {
      message: 'Este campo é obrigatório.',
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: value?.search || value?.service || '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershop?search=${data.search}`)
  }

  useEffect(() => {
    if (value) {
      form.setValue('search', value.search || value.service || '')
    }
  }, [value, form])

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-2 px-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar"
                  {...field}
                  className="w-full bg-[#1A1B1F]"
                />
                <Button type="submit">
                  <SearchIcon size={20} />
                </Button>
              </div>
              <FormMessage className="px-1 text-xs text-red-500" />
            </div>
          )}
        />
      </form>
    </Form>
  )
}
