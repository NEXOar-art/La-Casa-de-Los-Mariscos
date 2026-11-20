import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, LocateFixed, MapPin } from 'lucide-react';
import { RestaurantInfo } from '../data/restaurantData';

interface LocationMapProps {
  info: RestaurantInfo;
}

// Av. San Martín 232, Ushuaia, Tierra del Fuego, Argentina
const USHUAIA_COORDS: [number, number] = [-54.8056, -68.3013];

export function LocationMap({ info }: LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const map = L.map(el, {
      center: USHUAIA_COORDS,
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const customPin = L.divIcon({
      className: 'custom-marisqueria-pin',
      html: `<div style="width:28px;height:28px;border-radius:9999px;background:#B95347;border:3px solid #FBF8F5;box-shadow:0 4px 14px rgba(31,42,51,0.35);display:flex;align-items:center;justify-content:center;">
        <div style="width:8px;height:8px;border-radius:9999px;background:#FBF8F5;"></div>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });

    const marker = L.marker(USHUAIA_COORDS, { icon: customPin }).addTo(map);
    marker
      .bindPopup(
        `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:195px;color:#1F2A33;">
          <strong style="font-size:14px;display:block;margin-bottom:2px;color:#B95347;">${info.name}</strong>
          <span style="font-size:12px;color:#334155;display:block;">${info.address}</span>
          <span style="font-size:11px;color:#64748b;display:block;margin-top:4px;margin-bottom:8px;">${info.category} · ${info.priceRange}</span>
          <a href="${info.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#B95347;color:#ffffff;font-size:11px;font-weight:600;padding:5px 10px;border-radius:6px;text-decoration:none;">Abrir ubicación en Maps</a>
        </div>`
      )
      .openPopup();

    mapInstanceRef.current = map;

    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [info.address, info.category, info.googleMapsUrl, info.name, info.priceRange]);

  const handleRecenter = () => {
    mapInstanceRef.current?.setView(USHUAIA_COORDS, 16, { animate: true });
  };

  return (
    <div className="relative flex h-full min-h-[360px] w-full flex-col overflow-hidden rounded-xl border border-[#D6E2E5] bg-white shadow-sm">
      <div
        ref={mapContainerRef}
        aria-label={`Mapa interactivo de ${info.name} en ${info.address}`}
        className="z-10 h-full min-h-[360px] w-full"
      />

      <div className="absolute right-3 bottom-7 z-20 flex flex-wrap items-center gap-2">
        <a
          href={info.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#B95347] px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#9E4237]"
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Ver ubicación</span>
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={handleRecenter}
          title="Centrar mapa en el local"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#DECFC8] bg-[#FBF8F5]/95 px-3 py-1.5 text-xs font-semibold text-[#1F2A33] shadow-md transition-colors hover:border-[#B95347] hover:text-[#B95347] cursor-pointer"
        >
          <LocateFixed className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
          <span>Centrar local</span>
        </button>
      </div>
    </div>
  );
}
