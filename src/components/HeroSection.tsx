import { useEffect, useState } from 'react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { HERO_BACKGROUND_IMAGE, RestaurantInfo } from '../data/restaurantData';

interface HeroSectionProps {
  info: RestaurantInfo;
}

const HERO_SLIDES = [
  {
    kicker: 'Av. San Martín 232 · Ushuaia',
    title: 'La Casa de los Mariscos',
    detail:
      'Más de cinco décadas sirviendo centolla fueguina fresca, cazuelas calientes y sabores del Canal Beagle en nuestro clásico salón de madera.',
  },
  {
    kicker: 'Especialidad del Fin del Mundo',
    title: 'Centolla Viva, Cazuelas y Paellas',
    detail:
      'Mariscos seleccionados cada día y platos abundantes preparados al momento en mesas tradicionales para compartir.',
  },
  {
    kicker: 'Del Mar Patagónico a tu Mesa',
    title: 'Merluza Negra, Pulpo y Pastas Marineras',
    detail:
      'Recetas emblemáticas de puerto junto a etiquetas australes en un ambiente cálido y familiar.',
  },
];

export function HeroSection({ info }: HeroSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [titlesVisible, setTitlesVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  // 3 seconds visible, 3 seconds hidden so the hero local photo shines, then next slide
  useEffect(() => {
    if (paused) {
      setTitlesVisible(true);
      return;
    }

    const timer = window.setInterval(() => {
      setTitlesVisible((prevVisible) => {
        if (prevVisible) {
          return false;
        }
        setSlideIndex((prevIdx) => (prevIdx + 1) % HERO_SLIDES.length);
        return true;
      });
    }, 3000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const activeSlide = HERO_SLIDES[slideIndex];

  return (
    <section
      id="inicio"
      className="relative z-10 flex min-h-screen w-full flex-col justify-between overflow-hidden pt-16"
    >
      {/* Full-bleed crisp photograph of the restaurant */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt={`Fachada tradicional de ${info.name} en Ushuaia`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-[50%_35%]"
        />
      </div>

      {/* Top breathing space with subtle cycle toggle */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-2 rounded-lg bg-[#FBF8F5]/95 px-3.5 py-1.5 text-xs font-medium text-[#1F2A33] shadow-sm">
          <span>{info.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {info.reviewCount.toLocaleString('es-AR')} reseñas
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums text-[#B95347]">{info.priceRange}</span>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5D8D2] bg-[#FBF8F5]/95 px-3 py-1.5 text-xs font-medium text-[#1F2A33] shadow-sm transition-colors hover:border-[#B95347] cursor-pointer"
        >
          {paused ? (
            <>
              <Play className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
              <span>Reanudar títulos</span>
            </>
          ) : (
            <>
              <Pause className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
              <span>{titlesVisible ? 'Foto libre en 3s' : 'Mostrando local'}</span>
            </>
          )}
        </button>
      </div>

      {/* Center dynamic animated titles: 3s in -> 3s out revealing full restaurant background */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-6xl flex-col items-start px-4 py-12 sm:px-6">
        <div
          className={`max-w-3xl rounded-2xl border border-white/25 bg-[#231714]/72 p-6 shadow-xl transition-all duration-700 ease-out will-change-transform sm:p-8 ${
            titlesVisible
              ? 'translate-y-0 opacity-100'
              : '-translate-y-6 opacity-0 pointer-events-none'
          }`}
        >
          <p className="mb-2.5 text-sm font-semibold tracking-wide text-[#F6C8C2]">
            {activeSlide.kicker}
          </p>
          <h1
            className="font-display font-semibold tracking-tight text-[#FFFBF8] drop-shadow"
            style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.85rem)', lineHeight: 1.08 }}
          >
            {activeSlide.title}
          </h1>
          <p className="mt-3.5 max-w-xl text-base leading-relaxed text-[#F7ECE8] sm:text-lg">
            {activeSlide.detail}
          </p>
        </div>
      </div>

      {/* Permanently visible relevant restaurant information & primary actions */}
      <div className="relative z-10 border-t border-[#E5D8D2] bg-[#FBF8F5]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-display text-lg font-semibold text-[#1F2A33]">
              {info.name} — {info.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#52606D] sm:text-sm">
              <span>{info.address}</span>
              <span aria-hidden="true">·</span>
              <span>{info.hours}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-[#B95347]">
                {info.priceRange}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#carta"
              className="inline-flex items-center justify-center rounded-lg bg-[#B95347] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#9E4237] whitespace-nowrap"
            >
              Explorar la Carta
            </a>
            <a
              href="#reservas"
              className="inline-flex items-center justify-center rounded-lg border border-[#D8C5BE] bg-white px-5 py-2.5 text-sm font-medium text-[#1F2A33] transition-colors duration-200 hover:border-[#B95347] hover:text-[#B95347] whitespace-nowrap"
            >
              Reservar Mesa
            </a>
            <a
              href="#galeria"
              aria-label="Ir a la galería"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8C5BE] bg-white text-[#52606D] transition-colors hover:border-[#B95347] hover:text-[#B95347]"
            >
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
