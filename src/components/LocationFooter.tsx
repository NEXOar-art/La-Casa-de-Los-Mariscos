import {
  Clock,
  ExternalLink,
  Instagram,
  Lock,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react';
import { RestaurantInfo } from '../data/restaurantData';
import { buildWhatsAppUrl } from '../utils/formatters';
import { LocationMap } from './LocationMap';

interface LocationFooterProps {
  info: RestaurantInfo;
  onRequestAdmin: () => void;
}

export function LocationFooter({
  info,
  onRequestAdmin,
}: LocationFooterProps) {
  const quickWhatsApp = buildWhatsAppUrl(
    info.whatsappNumber,
    `Hola ${info.name}, quisiera hacer una consulta.`
  );

  return (
    <footer
      id="ubicacion"
      className="relative z-10 border-t border-[#D6E2E5] bg-[#EDF3F4] pt-20 pb-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Location & Interactive Map Split */}
        <div className="grid grid-cols-1 items-stretch gap-8 border-b border-[#D6E2E5] pb-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <LocationMap info={info} />
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D6E2E5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-6">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wider text-[#B95347]">
                04. Ubicación, Redes y Contacto
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[#1F2A33]">
                Dónde Estamos
              </h2>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#B95347]">
                <Star className="h-3.5 w-3.5 fill-[#B95347]" aria-hidden="true" />
                <span className="tabular-nums font-semibold">
                  {info.reviewCount.toLocaleString('es-AR')} reseñas ·{' '}
                  {info.category} · {info.priceRange}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#B95347]">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>Dirección</span>
                  </div>
                  <p className="text-sm font-medium text-[#1F2A33]">
                    {info.address}
                  </p>
                  <p className="text-xs text-[#52606D]">{info.neighborhood}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#B95347]">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>Horarios</span>
                  </div>
                  <p className="text-sm font-medium text-[#1F2A33]">
                    {info.hours}
                  </p>
                  <p className="text-xs text-[#52606D]">
                    Salón · Take Away · Delivery
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#B95347]">
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    <span>Instagram</span>
                  </div>
                  <a
                    href={info.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1F2A33] underline-offset-4 hover:text-[#B95347] hover:underline"
                  >
                    <span>{info.instagramHandle}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#B95347]">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>WhatsApp Directo</span>
                  </div>
                  <a
                    href={quickWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono-num text-sm font-medium text-[#1F2A33] underline-offset-4 hover:text-[#B95347] hover:underline"
                  >
                    <span>+{info.whatsappNumber}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#E6ECEE] pt-6">
              <a
                href={info.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#B95347] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#9E4237]"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Ver ubicación en Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <a
                href={quickWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#DECFC8] bg-[#FBF8F5] px-4 py-2.5 text-xs font-semibold text-[#1F2A33] transition-colors hover:border-[#B95347] hover:text-[#B95347]"
              >
                <MessageCircle className="h-4 w-4 text-[#B95347]" aria-hidden="true" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Quiet Footer Summary */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-[#1F2A33]">
              {info.name}
            </p>
            <p className="mt-1 text-xs text-[#52606D]">
              {info.category} · {info.address} · {info.priceRange} ·{' '}
              {info.reviewCount.toLocaleString('es-AR')} reseñas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#52606D]">
            <a href="#inicio" className="hover:text-[#B95347]">
              Inicio
            </a>
            <a href="#galeria" className="hover:text-[#B95347]">
              Galería
            </a>
            <a href="#carta" className="hover:text-[#B95347]">
              La Carta
            </a>
            <a href="#reservas" className="hover:text-[#B95347]">
              Reservas
            </a>
            <a
              href={info.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#B95347] px-3 py-1.5 font-semibold text-white transition-colors hover:bg-[#9E4237]"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ubicación</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onRequestAdmin}
              className="inline-flex items-center gap-1 hover:text-[#B95347] cursor-pointer"
            >
              <Lock className="h-3 w-3" aria-hidden="true" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
