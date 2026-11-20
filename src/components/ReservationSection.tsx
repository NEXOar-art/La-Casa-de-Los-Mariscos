import { useState, FormEvent } from 'react';
import { Calendar, CheckCircle2, Clock, Copy, ExternalLink, Users } from 'lucide-react';
import { RESERVATION_IMAGE, RestaurantInfo } from '../data/restaurantData';
import { buildWhatsAppUrl } from '../utils/formatters';

interface ReservationSectionProps {
  info: RestaurantInfo;
}

export function ReservationSection({ info }: ReservationSectionProps) {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('21:00');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor ingresá tu nombre completo.');
      return;
    }
    const numGuests = Number(guests);
    if (!guests || Number.isNaN(numGuests) || numGuests < 1) {
      setError('Indicá una cantidad válida de personas.');
      return;
    }
    if (!date) {
      setError('Seleccioná la fecha de tu reserva.');
      return;
    }
    if (date < todayIso) {
      setError('La fecha de reserva no puede ser anterior a hoy.');
      return;
    }
    if (!time) {
      setError('Seleccioná un horario.');
      return;
    }

    const lines = [
      `Hola *${info.name}*, quiero solicitar una reserva:`,
      `• *Nombre:* ${name.trim()}`,
      `• *Personas:* ${numGuests}`,
      `• *Fecha:* ${date}`,
      `• *Hora:* ${time} hs`,
    ];
    if (email.trim()) {
      lines.push(`• *Email:* ${email.trim()}`);
    }
    lines.push('¡Muchas gracias!');

    setSubmittedMsg(lines.join('\n'));
    setCopied(false);
  };

  const waUrl = submittedMsg
    ? buildWhatsAppUrl(info.whatsappNumber, submittedMsg)
    : '#';

  const handleCopy = async () => {
    if (!submittedMsg) return;
    try {
      await navigator.clipboard.writeText(submittedMsg);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked in restricted contexts
    }
  };

  return (
    <section
      id="reservas"
      className="relative z-10 border-t border-[#E5D8D2] bg-[#FBF8F5]/92 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left: Form */}
          <div className="flex flex-col justify-between rounded-xl border border-[#E5D8D2] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wider text-[#B95347]">
                03. Reservas Directas
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[#1F2A33] sm:text-4xl">
                Reservá tu Mesa
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#52606D]">
                Completá los datos de tu visita y enviá la solicitud directo por
                WhatsApp para confirmar disponibilidad al instante.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label
                    htmlFor="res-name"
                    className="mb-1.5 block text-xs font-semibold text-[#334155]"
                  >
                    Nombre y apellido *
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSubmittedMsg(null);
                    }}
                    placeholder="Ej: Martín Rodríguez"
                    className="w-full rounded-lg border border-[#DECFC8] bg-[#FBF8F5] px-3.5 py-2.5 text-sm text-[#1F2A33] placeholder-[#7B8794] focus:border-[#B95347] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="res-guests"
                      className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#334155]"
                    >
                      <Users className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
                      <span>Personas *</span>
                    </label>
                    <input
                      id="res-guests"
                      type="number"
                      min={1}
                      max={30}
                      required
                      value={guests}
                      onChange={(e) => {
                        setGuests(e.target.value);
                        setSubmittedMsg(null);
                      }}
                      className="w-full rounded-lg border border-[#DECFC8] bg-[#FBF8F5] px-3.5 py-2.5 font-mono-num text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-date"
                      className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#334155]"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
                      <span>Fecha *</span>
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      min={todayIso}
                      required
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSubmittedMsg(null);
                      }}
                      className="w-full rounded-lg border border-[#DECFC8] bg-[#FBF8F5] px-3.5 py-2.5 text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none [color-scheme:light]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-time"
                      className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#334155]"
                    >
                      <Clock className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
                      <span>Hora *</span>
                    </label>
                    <select
                      id="res-time"
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        setSubmittedMsg(null);
                      }}
                      className="w-full rounded-lg border border-[#DECFC8] bg-[#FBF8F5] px-3.5 py-2.5 font-mono-num text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
                    >
                      <option value="12:30">12:30 hs</option>
                      <option value="13:30">13:30 hs</option>
                      <option value="14:30">14:30 hs</option>
                      <option value="20:00">20:00 hs</option>
                      <option value="20:30">20:30 hs</option>
                      <option value="21:00">21:00 hs</option>
                      <option value="21:30">21:30 hs</option>
                      <option value="22:00">22:00 hs</option>
                      <option value="22:30">22:30 hs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="res-email"
                    className="mb-1.5 block text-xs font-semibold text-[#334155]"
                  >
                    Email (opcional)
                  </label>
                  <input
                    id="res-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmittedMsg(null);
                    }}
                    placeholder="tu@email.com"
                    className="w-full rounded-lg border border-[#DECFC8] bg-[#FBF8F5] px-3.5 py-2.5 text-sm text-[#1F2A33] placeholder-[#7B8794] focus:border-[#B95347] focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-[#B95347] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9E4237] cursor-pointer"
                >
                  Preparar Reserva por WhatsApp
                </button>
              </form>

              {submittedMsg && (
                <div className="mt-6 rounded-xl border border-[#A5D3C4] bg-[#EDF7F3] p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#1D7A5F]"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1F2A33]">
                        Solicitud lista para enviar
                      </p>
                      <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#334155]">
                        {submittedMsg}
                      </pre>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-[#1F8A4C] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        >
                          <span>Enviar por WhatsApp</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2 text-xs font-medium text-[#1F2A33] hover:border-[#B95347] cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copied ? 'Copiado' : 'Copiar mensaje'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Warm Wooden Dining Room Image */}
          <div className="relative overflow-hidden rounded-xl border border-[#E5D8D2] bg-[#F4ECE8] shadow-sm lg:col-span-5">
            <img
              src={RESERVATION_IMAGE}
              alt="Salón con mesas y sillas de madera de La Casa de los Mariscos"
              referrerPolicy="no-referrer"
              className="h-72 w-full object-cover lg:h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1715]/90 via-[#1F1715]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-xs font-semibold text-[#F6C8C2]">
                Horarios de Atención
              </p>
              <p className="font-display mt-1 text-xl font-semibold text-white">
                {info.hours}
              </p>
              <p className="mt-2 text-sm text-[#F5ECE8]">
                Salón tradicional con mesas y sillas de madera en el centro de Ushuaia.
                Rango promedio por persona: <span className="tabular-nums font-semibold text-white">{info.priceRange}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
