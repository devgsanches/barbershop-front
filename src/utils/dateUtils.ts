/**
 * Converte uma data local para UTC
 * @param localDate - Data local
 * @returns Data em UTC
 */
export function localToUTC(localDate: Date): Date {
  // Cria uma nova data UTC baseada nos componentes da data local
  const utcDate = new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds(),
      localDate.getMilliseconds(),
    ),
  )

  return utcDate
}

/**
 * Converte uma data UTC para local
 * @param utcDate - Data em UTC
 * @returns Data local
 */
export function utcToLocal(utcDate: Date): Date {
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
}

/**
 * Formata uma data para exibição em português
 * @param date - Data a ser formatada
 * @returns String formatada
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

/**
 * Obtém o offset do timezone atual em minutos
 * @returns Offset em minutos
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset()
}
