/** Mantém só os dígitos, até 11 (DDD + 9 dígitos). */
export const phoneDigits = (v: string) => v.replace(/\D/g, '').replace(/^55(?=\d{11})/, '').slice(0, 11);

/** (11) 91234-5678 enquanto a pessoa digita. */
export function maskPhone(v: string) {
  const d = phoneDigits(v);
  if (d.length < 3) return d;
  if (d.length < 8) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

/** Celular brasileiro válido: DDD + 9 + 8 dígitos. */
export const isMobileBR = (v: string) => /^[1-9]{2}9\d{8}$/.test(phoneDigits(v));

/** Formato internacional que o Supabase espera: +5511912345678. */
export const toE164 = (v: string) => `+55${phoneDigits(v)}`;

/** +5511912345678 -> (11) 91234-5678 */
export const fromE164 = (v?: string | null) => (v ? maskPhone(v.replace(/^\+?55/, '')) : '');

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
