import { useMemo, useState } from 'react';
import {
  Check,
  Lock,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Unlock,
  X,
} from 'lucide-react';
import {
  MENU_CATEGORIES,
  MenuCategory,
  MenuItem,
} from '../data/restaurantData';
import { formatARS } from '../utils/formatters';

interface MenuSectionProps {
  items: MenuItem[];
  cartQuantities: Record<string, number>;
  isAdmin: boolean;
  onAddToCart: (item: MenuItem) => void;
  onOpenCart: () => void;
  onRequestAdminLogin: () => void;
  onExitAdmin: () => void;
  onUpdatePrice: (id: string, newPrice: number) => void;
  onResetMenu: () => void;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function MenuSection({
  items,
  cartQuantities,
  isAdmin,
  onAddToCart,
  onOpenCart,
  onRequestAdminLogin,
  onExitAdmin,
  onUpdatePrice,
  onResetMenu,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    MenuCategory | 'Todas'
  >('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [draftPrices, setDraftPrices] = useState<Record<string, string>>({});

  const filteredItems = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todas' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        normalizeText(item.name).includes(q) ||
        normalizeText(item.description).includes(q) ||
        normalizeText(item.category).includes(q) ||
        (item.tag && normalizeText(item.tag).includes(q))
      );
    });
  }, [items, selectedCategory, searchQuery]);

  const groupedItems = useMemo(() => {
    const groups: { category: MenuCategory; items: MenuItem[] }[] = [];
    for (const cat of MENU_CATEGORIES) {
      const catItems = filteredItems.filter((item) => item.category === cat);
      if (catItems.length > 0) {
        groups.push({ category: cat, items: catItems });
      }
    }
    return groups;
  }, [filteredItems]);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setRecentlyAddedId(item.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === item.id ? null : curr));
    }, 900);
  };

  const handlePriceChange = (item: MenuItem, rawValue: string) => {
    setDraftPrices((prev) => ({
      ...prev,
      [item.id]: rawValue,
    }));
    const parsed = Number(rawValue.replace(/[^\d]/g, ''));
    if (!Number.isNaN(parsed) && parsed > 0) {
      onUpdatePrice(item.id, parsed);
    }
  };

  const handlePriceBlur = (item: MenuItem) => {
    const raw = draftPrices[item.id];
    if (raw === undefined) return;
    const parsed = Number(raw.replace(/[^\d]/g, ''));
    if (!Number.isNaN(parsed) && parsed > 0) {
      onUpdatePrice(item.id, parsed);
    }
    setDraftPrices((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  };

  const totalCartItems = Object.values(cartQuantities).reduce(
    (sum, q) => sum + q,
    0
  );

  return (
    <section
      id="carta"
      className="relative z-10 scroll-mt-16 border-t border-[#E5D8D2] bg-[#F5ECE8]/90 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header + Admin Toggle */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-[#B95347]">
              02. Taxonomía Gastronómica
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#1F2A33] sm:text-4xl">
              La Carta Completa
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#52606D]">
              Explorá nuestras categorías de mariscos y pescados, buscá por
              ingrediente o frase y armá tu pedido para enviarlo directo por
              WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setDraftPrices({});
                    onResetMenu();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2 text-xs font-medium text-[#1F2A33] transition-colors hover:border-[#B95347] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Restablecer precios</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftPrices({});
                    onExitAdmin();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#B95347] bg-[#F9E3E0] px-3.5 py-2 text-xs font-semibold text-[#9E4237] cursor-pointer"
                >
                  <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Salir Modo Admin</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onRequestAdminLogin}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2 text-xs font-medium text-[#52606D] transition-colors hover:border-[#B95347] hover:text-[#1F2A33] cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-[#B95347]" aria-hidden="true" />
                <span>Editar precios (Admin)</span>
              </button>
            )}

            {totalCartItems > 0 && (
              <button
                type="button"
                onClick={onOpenCart}
                className="inline-flex items-center gap-2 rounded-lg bg-[#B95347] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#9E4237] cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ver Carrito ({totalCartItems})</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Taxonomy Bar */}
        <div className="mb-10 flex flex-col gap-4 rounded-xl border border-[#E5D8D2] bg-white/95 p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#64748B]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por plato, ingrediente o frase (ej: pulpo, langostinos, centolla, azafrán...)"
              aria-label="Buscar producto en la carta"
              className="w-full rounded-lg border border-[#DECFC8] bg-[#FBF8F5] py-2.5 pr-10 pl-10 text-sm text-[#1F2A33] placeholder-[#7B8794] transition-colors focus:border-[#B95347] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#64748B] hover:text-[#1F2A33] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Categorías de la carta"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'Todas'}
              onClick={() => setSelectedCategory('Todas')}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'Todas'
                  ? 'bg-[#B95347] text-white font-semibold'
                  : 'bg-[#F5ECE8] text-[#4A5568] hover:bg-[#EBDBD4] hover:text-[#1F2A33]'
              }`}
            >
              Todas ({items.length})
            </button>
            {MENU_CATEGORIES.map((category) => {
              const count = items.filter((i) => i.category === category).length;
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#B95347] text-white font-semibold'
                      : 'bg-[#F5ECE8] text-[#4A5568] hover:bg-[#EBDBD4] hover:text-[#1F2A33]'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Mode Notice */}
        {isAdmin && (
          <div className="mb-8 rounded-xl border border-[#DF9E96] bg-[#FDF2F0] px-5 py-3.5 text-sm text-[#7A3028]">
            Modo Administrador habilitado: editá cualquier precio directamente en
            la carta. Los cambios se guardan automáticamente en este navegador y
            se reflejan de inmediato en el carrito.
          </div>
        )}

        {/* Menu Items (Typographic layout WITHOUT product images) */}
        {groupedItems.length === 0 ? (
          <div className="rounded-xl border border-[#E5D8D2] bg-white p-12 text-center">
            <p className="font-display text-xl text-[#1F2A33]">
              No encontramos platos que coincidan con “{searchQuery}”
            </p>
            <p className="mt-2 text-sm text-[#52606D]">
              Probá buscando otro ingrediente o limpiando los filtros de categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
              }}
              className="mt-5 rounded-lg bg-[#B95347] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Ver toda la carta
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedItems.map((group) => (
              <div key={group.category}>
                <div className="mb-5 flex items-baseline justify-between border-b border-[#DECFC8] pb-3">
                  <h3 className="font-display text-2xl font-semibold text-[#1F2A33]">
                    {group.category}
                  </h3>
                  <span className="tabular-nums text-xs text-[#52606D]">
                    {group.items.length} opciones
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {group.items.map((item) => {
                    const qty = cartQuantities[item.id] || 0;
                    const justAdded = recentlyAddedId === item.id;
                    const draftValue =
                      draftPrices[item.id] !== undefined
                        ? draftPrices[item.id]
                        : String(item.price);

                    return (
                      <article
                        key={item.id}
                        className="flex flex-col justify-between gap-4 rounded-xl border border-[#E5D8D2] bg-white p-5 shadow-xs transition-colors duration-200 hover:border-[#D98A82]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-display text-lg font-medium text-[#1F2A33]">
                              {item.name}
                            </h4>
                            {item.tag && (
                              <span className="shrink-0 text-xs font-semibold text-[#B95347]">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-[#52606D]">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-[#F0E6E1] pt-3.5">
                          {isAdmin ? (
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#B95347]">
                              <span>$</span>
                              <input
                                type="number"
                                min={1}
                                step={100}
                                value={draftValue}
                                onChange={(e) =>
                                  handlePriceChange(item, e.target.value)
                                }
                                onBlur={() => handlePriceBlur(item)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                aria-label={`Editar precio de ${item.name}`}
                                className="w-28 rounded-md border border-[#D98A82] bg-[#FBF8F5] px-2.5 py-1.5 font-mono-num text-sm font-semibold text-[#1F2A33] focus:border-[#B95347] focus:outline-none"
                              />
                            </label>
                          ) : (
                            <span className="font-mono-num text-base font-semibold text-[#1F2A33]">
                              {formatARS(item.price)}
                            </span>
                          )}

                          <div className="flex items-center gap-2">
                            {qty > 0 && (
                              <span className="tabular-nums text-xs font-semibold text-[#B95347]">
                                {qty} en carrito
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleAdd(item)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                                justAdded
                                  ? 'bg-[#2E6F5E] text-white'
                                  : 'bg-[#F6ECE8] text-[#1F2A33] hover:bg-[#B95347] hover:text-white'
                              }`}
                            >
                              {justAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>Agregado</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>Agregar al carrito</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
