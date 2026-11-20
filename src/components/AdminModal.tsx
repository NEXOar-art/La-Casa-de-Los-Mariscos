import { FormEvent, useEffect, useRef, useState } from 'react';
import { Download, Lock, Settings, X } from 'lucide-react';
import { RestaurantInfo } from '../data/restaurantData';

interface AdminModalProps {
  open: boolean;
  isAdmin: boolean;
  info: RestaurantInfo;
  onClose: () => void;
  onUnlock: () => void;
  onUpdateInfo: (next: RestaurantInfo) => void;
}

export function AdminModal({
  open,
  isAdmin,
  info,
  onClose,
  onUnlock,
  onUpdateInfo,
}: AdminModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [formInfo, setFormInfo] = useState<RestaurantInfo>(info);
  const [savedNotice, setSavedNotice] = useState(false);
  const [zipAvailable, setZipAvailable] = useState(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setFormInfo(info);
      setError('');
      setPin('');
      setSavedNotice(false);
    }
    wasOpenRef.current = open;
  }, [open, info]);

  useEffect(() => {
    if (!open || !isAdmin) return;
    let cancelled = false;
    fetch('./__export-project.zip', { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return;
        const type = res.headers.get('content-type') || '';
        setZipAvailable(res.ok && type.includes('application/zip'));
      })
      .catch(() => {
        if (!cancelled) setZipAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, isAdmin]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '0608') {
      setError('');
      setPin('');
      onUnlock();
      setFormInfo(info);
    } else {
      setError('Clave incorrecta. Intentá nuevamente.');
    }
  };

  const handleInfoSave = (e: FormEvent) => {
    e.preventDefault();
    const cleanedName = formInfo.name.trim();
    const cleanedWhatsapp = formInfo.whatsappNumber.replace(/[^\d]/g, '');
    const cleanedAddress = formInfo.address.trim();

    if (!cleanedName || !cleanedWhatsapp || !cleanedAddress) {
      setError('Completá nombre del local, WhatsApp válido y dirección.');
      return;
    }

    const rawHandle = formInfo.instagramHandle.trim().replace(/^@+/, '');
    const normalizedHandle = rawHandle
      ? `@${rawHandle}`
      : info.instagramHandle;
    const syncedInstagramUrl =
      rawHandle && normalizedHandle !== info.instagramHandle
        ? `https://www.instagram.com/${rawHandle}`
        : formInfo.instagramUrl;

    setError('');
    onUpdateInfo({
      ...formInfo,
      name: cleanedName,
      whatsappNumber: cleanedWhatsapp,
      address: cleanedAddress,
      instagramHandle: normalizedHandle,
      instagramUrl: syncedInstagramUrl,
      hours: formInfo.hours.trim() || info.hours,
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel Administrador"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2A33]/60 p-4"
    >
      <div className="w-full max-w-md rounded-xl border border-[#E5D8D2] bg-[#FBF8F5] p-6 text-[#1F2A33] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5D8D2] pb-3.5">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Settings className="h-5 w-5 text-[#B95347]" aria-hidden="true" />
            ) : (
              <Lock className="h-5 w-5 text-[#B95347]" aria-hidden="true" />
            )}
            <h2 className="font-display text-xl font-semibold">
              {isAdmin ? 'Datos del Restaurante' : 'Acceso Administrador'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel administrador"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DECFC8] text-[#52606D] hover:border-[#B95347] hover:text-[#1F2A33] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isAdmin ? (
          <form onSubmit={handlePinSubmit} className="mt-5 space-y-4">
            <p className="text-sm text-[#52606D]">
              Ingresá la clave de administrador para editar precios de La Carta y
              configurar los datos de contacto del local.
            </p>
            <div>
              <label
                htmlFor="admin-pin"
                className="mb-1.5 block text-xs font-semibold text-[#334155]"
              >
                Clave de acceso
              </label>
              <input
                id="admin-pin"
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2.5 font-mono-num text-base tracking-widest text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#DECFC8] bg-white px-4 py-2 text-xs font-medium text-[#52606D] hover:text-[#1F2A33] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#B95347] px-5 py-2 text-xs font-semibold text-white hover:bg-[#9E4237] cursor-pointer"
              >
                Ingresar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleInfoSave} className="mt-5 space-y-3.5">
            <p className="text-xs text-[#52606D]">
              Los precios se editan directamente sobre cada plato en La Carta.
              Aquí podés actualizar el nombre, WhatsApp y ubicación del local.
            </p>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#334155]">
                Nombre del local
              </label>
              <input
                type="text"
                value={formInfo.name}
                onChange={(e) =>
                  setFormInfo({ ...formInfo, name: e.target.value })
                }
                className="w-full rounded-lg border border-[#DECFC8] bg-white px-3 py-2 text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#334155]">
                WhatsApp (código país + número, sin +)
              </label>
              <input
                type="text"
                value={formInfo.whatsappNumber}
                onChange={(e) =>
                  setFormInfo({ ...formInfo, whatsappNumber: e.target.value })
                }
                className="w-full rounded-lg border border-[#DECFC8] bg-white px-3 py-2 font-mono-num text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#334155]">
                Dirección
              </label>
              <input
                type="text"
                value={formInfo.address}
                onChange={(e) =>
                  setFormInfo({ ...formInfo, address: e.target.value })
                }
                className="w-full rounded-lg border border-[#DECFC8] bg-white px-3 py-2 text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#334155]">
                Instagram (@usuario)
              </label>
              <input
                type="text"
                value={formInfo.instagramHandle}
                onChange={(e) =>
                  setFormInfo({ ...formInfo, instagramHandle: e.target.value })
                }
                className="w-full rounded-lg border border-[#DECFC8] bg-white px-3 py-2 text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#334155]">
                Horarios
              </label>
              <input
                type="text"
                value={formInfo.hours}
                onChange={(e) =>
                  setFormInfo({ ...formInfo, hours: e.target.value })
                }
                className="w-full rounded-lg border border-[#DECFC8] bg-white px-3 py-2 text-sm text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
                {error}
              </p>
            )}

            {savedNotice && (
              <p className="text-xs font-semibold text-[#1D7A5F]">
                Datos guardados correctamente.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
              {zipAvailable ? (
                <a
                  href="./__export-project.zip"
                  download="la-casa-de-los-mariscos-completo.zip"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2 text-xs font-semibold text-[#1F2A33] hover:border-[#B95347] hover:text-[#B95347]"
                >
                  <Download className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
                  <span>Descargar ZIP (Código + dist)</span>
                </a>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-[#DECFC8] bg-white px-4 py-2 text-xs font-medium text-[#52606D] cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#B95347] px-5 py-2 text-xs font-semibold text-white hover:bg-[#9E4237] cursor-pointer"
                >
                  Guardar datos
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
