import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/restaurantData';

export function GallerySection() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((i) =>
          i === null ? null : (i + 1) % GALLERY_PHOTOS.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((i) =>
          i === null
            ? null
            : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx]);

  const leadPhoto = GALLERY_PHOTOS[0];
  const secondaryPhotos = GALLERY_PHOTOS.slice(1, 5);

  return (
    <section
      id="galeria"
      className="relative z-10 border-t border-[#E5D8D2] bg-[#FBF8F5]/90 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-[#B95347]">
              01. Experiencia Visual
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#1F2A33] sm:text-4xl">
              Nuestra Cocina y Salón en Cinco Instantes
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#52606D]">
            Selección de nuestros platos insignia y nuestro tradicional salón de
            madera en Ushuaia. Hacé clic en cualquier fotografía para
            inspeccionarla en detalle.
          </p>
        </div>

        {/* Asymmetric 5-photo showcase: 1 lead feature + 4 uniform 4:3 frames */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Photo 1 (Lead) */}
          <button
            type="button"
            onClick={() => setLightboxIdx(0)}
            className="group relative overflow-hidden rounded-xl border border-[#E5D8D2] bg-[#F4ECE8] text-left shadow-sm lg:col-span-6 cursor-pointer"
          >
            <div className="aspect-[4/3] w-full overflow-hidden lg:h-full lg:min-h-[420px]">
              <img
                src={leadPhoto.src}
                alt={leadPhoto.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1715]/88 via-[#1F1715]/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
              <div>
                <p className="text-xs font-semibold text-[#F6C8C2]">
                  {leadPhoto.category}
                </p>
                <h3 className="font-display mt-1 text-xl font-semibold text-white">
                  {leadPhoto.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm text-[#F5ECE8]">
                  {leadPhoto.caption}
                </p>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-[#FBF8F5]/90 text-[#1F2A33] transition-colors group-hover:border-[#B95347] group-hover:text-[#B95347]">
                <Expand className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </button>

          {/* Photos 2 to 5 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-6">
            {secondaryPhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxIdx(index + 1)}
                className="group relative overflow-hidden rounded-xl border border-[#E5D8D2] bg-[#F4ECE8] text-left shadow-sm cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1715]/88 via-[#1F1715]/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs font-semibold text-[#F6C8C2]">
                    {photo.category}
                  </p>
                  <h3 className="font-display mt-0.5 text-base font-semibold text-white">
                    {photo.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY_PHOTOS[lightboxIdx].title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIdx(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2A33]/85 p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#E5D8D2] bg-[#FBF8F5] text-[#1F2A33] hover:border-[#B95347] hover:text-[#B95347] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setLightboxIdx(
                (lightboxIdx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
              )
            }
            aria-label="Foto anterior"
            className="mr-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E5D8D2] bg-[#FBF8F5] text-[#1F2A33] hover:border-[#B95347] hover:text-[#B95347] sm:inline-flex cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="max-w-4xl overflow-hidden rounded-xl border border-[#E5D8D2] bg-[#FBF8F5] shadow-2xl">
            <img
              src={GALLERY_PHOTOS[lightboxIdx].src}
              alt={GALLERY_PHOTOS[lightboxIdx].title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-full object-cover"
            />
            <div className="flex flex-col gap-3 border-t border-[#E5D8D2] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-[#B95347]">
                  {GALLERY_PHOTOS[lightboxIdx].category}
                </p>
                <h3 className="font-display text-xl font-semibold text-[#1F2A33]">
                  {GALLERY_PHOTOS[lightboxIdx].title}
                </h3>
                <p className="mt-1 text-sm text-[#52606D]">
                  {GALLERY_PHOTOS[lightboxIdx].caption}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIdx(
                        (lightboxIdx - 1 + GALLERY_PHOTOS.length) %
                          GALLERY_PHOTOS.length
                      )
                    }
                    aria-label="Foto anterior"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DECFC8] bg-white text-[#1F2A33] cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIdx((lightboxIdx + 1) % GALLERY_PHOTOS.length)
                    }
                    aria-label="Foto siguiente"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DECFC8] bg-white text-[#1F2A33] cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <span className="tabular-nums font-mono-num text-xs text-[#52606D] shrink-0">
                  {lightboxIdx + 1} / {GALLERY_PHOTOS.length}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setLightboxIdx((lightboxIdx + 1) % GALLERY_PHOTOS.length)
            }
            aria-label="Foto siguiente"
            className="ml-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E5D8D2] bg-[#FBF8F5] text-[#1F2A33] hover:border-[#B95347] hover:text-[#B95347] sm:inline-flex cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
