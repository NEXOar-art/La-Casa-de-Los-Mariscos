export function formatARS(amount: number): string {
  return `$ ${amount.toLocaleString('es-AR')}`;
}

export function cleanWhatsAppPhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = cleanWhatsAppPhone(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
