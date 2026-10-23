export function formatarData(iso: string | null | undefined): string {
  if (!iso) return '';

  let texto = iso.replace(/(\.\d{3})\d+/, '$1');
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(texto)) texto += 'Z';

  const data = new Date(texto);
  if (isNaN(data.getTime())) return '';

  const dois = (n: number) => String(n).padStart(2, '0');
  return (
    `${dois(data.getDate())}/${dois(data.getMonth() + 1)}/${data.getFullYear()} ` +
    `${dois(data.getHours())}:${dois(data.getMinutes())}`
  );
}