import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

interface NavbarProps {
  restaurantName: string;
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({
  restaurantName,
  cartCount,
  onOpenCart,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#galeria', label: 'Galería' },
    { href: '#carta', label: 'La Carta' },
    { href: '#reservas', label: 'Reservas' },
    { href: '#ubicacion', label: 'Ubicación' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[#E5D8D2] bg-[#FBF8F5]/92">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single clean wordmark */}
        <a
          href="#inicio"
          className="font-display text-lg font-semibold tracking-tight text-[#1F2A33] whitespace-nowrap shrink-0 sm:text-xl"
        >
          {restaurantName}
        </a>

        {/* Zone 2: Clean single-line text links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52606D]"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 transition-colors duration-200 hover:text-[#1F2A33] whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#B95347] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 rounded-lg bg-[#B95347] px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#9E4237] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Carrito</span>
            <span className="tabular-nums font-mono-num font-bold">
              ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DECFC8] text-[#1F2A33] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navegación móvil"
          className="border-t border-[#E5D8D2] bg-[#FBF8F5] px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#1F2A33] hover:bg-[#F4ECE8]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
