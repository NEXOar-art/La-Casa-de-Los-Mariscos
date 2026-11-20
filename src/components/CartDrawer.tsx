import { FormEvent, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { MenuItem, RestaurantInfo } from '../data/restaurantData';
import { buildWhatsAppUrl, formatARS } from '../utils/formatters';

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

type ConsumptionMode = 'local' | 'takeaway' | 'delivery';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  entries: CartEntry[];
  info: RestaurantInfo;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  open,
  onClose,
  entries,
  info,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [mode, setMode] = useState<ConsumptionMode>('local');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const total = entries.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  useEffect(() => {
    setOrderMessage(null);
  }, [total]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (entries.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }
    if (!customerName.trim()) {
      setError('Por favor ingresá tu nombre.');
      return;
    }
    if (mode === 'local' && !tableNumber.trim()) {
      setError('Indicá el número de mesa donde estás ubicado.');
      return;
    }
    if (mode === 'delivery' && !deliveryAddress.trim()) {
      setError('Ingresá la dirección para el delivery.');
      return;
    }

    const modeLabel =
      mode === 'local'
        ? `En el local (Mesa ${tableNumber.trim()})`
        : mode === 'takeaway'
          ? 'Para llevar (Take Away)'
          : `Delivery (${deliveryAddress.trim()})`;

    const itemLines = entries.map(
      (e) =>
        `• ${e.quantity}x ${e.item.name} — ${formatARS(e.item.price * e.quantity)}`
    );

    const lines = [
      `Hola *${info.name}*, envío mi pedido desde la web:`,
      `• *Nombre:* ${customerName.trim()}`,
      `• *Modalidad:* ${modeLabel}`,
      '',
      '*Detalle del pedido:*',
      ...itemLines,
      '',
      `*Total estimado:* ${formatARS(total)}`,
    ];

    if (notes.trim()) {
      lines.push(`*Notas:* ${notes.trim()}`);
    }

    setOrderMessage(lines.join('\n'));
    setCopied(false);
  };

  const waUrl = orderMessage
    ? buildWhatsAppUrl(info.whatsappNumber, orderMessage)
    : '#';

  const handleCopy = async () => {
    if (!orderMessage) return;
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-[#1F2A33]/60"
    >
      <div className="flex h-full w-full max-w-lg flex-col border-l border-[#E5D8D2] bg-[#FBF8F5] text-[#1F2A33] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5D8D2] bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#B95347]" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold">Tu Pedido</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DECFC8] text-[#52606D] hover:border-[#B95347] hover:text-[#1F2A33] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <ShoppingBag
                className="mb-3 h-10 w-10 text-[#C5B4AD]"
                aria-hidden="true"
              />
              <p className="font-display text-lg text-[#1F2A33]">
                Todavía no agregaste platos
              </p>
              <p className="mt-1 max-w-xs text-sm text-[#52606D]">
                Elegí entradas, tiraditos, paellas o bebidas desde La Carta para
                armar tu pedido.
              </p>
              <a
                href="#carta"
                onClick={onClose}
                className="mt-5 rounded-lg bg-[#B95347] px-4 py-2 text-xs font-semibold text-white"
              >
                Ir a La Carta
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#52606D]">
                    Productos seleccionados
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      setOrderMessage(null);
                    }}
                    className="text-xs text-[#52606D] underline-offset-4 hover:text-[#B91C1C] hover:underline cursor-pointer"
                  >
                    Vaciar carrito
                  </button>
                </div>

                {entries.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#E5D8D2] bg-white p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#1F2A33]">
                        {item.name}
                      </p>
                      <p className="font-mono-num text-xs text-[#52606D]">
                        {formatARS(item.price)} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateQty(item.id, -1);
                          setOrderMessage(null);
                        }}
                        aria-label={`Restar uno de ${item.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#DECFC8] bg-[#FBF8F5] text-[#1F2A33] hover:border-[#B95347] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono-num text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateQty(item.id, 1);
                          setOrderMessage(null);
                        }}
                        aria-label={`Sumar uno de ${item.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#DECFC8] bg-[#FBF8F5] text-[#1F2A33] hover:border-[#B95347] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveItem(item.id);
                          setOrderMessage(null);
                        }}
                        aria-label={`Quitar ${item.name}`}
                        className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] hover:text-[#B91C1C] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-y border-[#E5D8D2] py-3.5">
                <span className="text-sm font-medium text-[#52606D]">
                  Total del pedido
                </span>
                <span className="font-mono-num text-xl font-bold text-[#B95347]">
                  {formatARS(total)}
                </span>
              </div>

              {/* Customer & Consumption Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label
                    htmlFor="cart-name"
                    className="mb-1.5 block text-xs font-semibold text-[#334155]"
                  >
                    Tu nombre *
                  </label>
                  <input
                    id="cart-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setOrderMessage(null);
                    }}
                    placeholder="Ej: Sofía López"
                    className="w-full rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2.5 text-sm text-[#1F2A33] placeholder-[#7B8794] focus:border-[#B95347] focus:outline-none"
                  />
                </div>

                <div>
                  <span className="mb-1.5 block text-xs font-semibold text-[#334155]">
                    Modalidad de consumo *
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('local');
                        setError('');
                        setOrderMessage(null);
                      }}
                      className={`rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        mode === 'local'
                          ? 'border-[#B95347] bg-[#B95347] text-white'
                          : 'border-[#DECFC8] bg-white text-[#52606D] hover:border-[#B95347]'
                      }`}
                    >
                      En el local
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('takeaway');
                        setError('');
                        setOrderMessage(null);
                      }}
                      className={`rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        mode === 'takeaway'
                          ? 'border-[#B95347] bg-[#B95347] text-white'
                          : 'border-[#DECFC8] bg-white text-[#52606D] hover:border-[#B95347]'
                      }`}
                    >
                      Para llevar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('delivery');
                        setError('');
                        setOrderMessage(null);
                      }}
                      className={`rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        mode === 'delivery'
                          ? 'border-[#B95347] bg-[#B95347] text-white'
                          : 'border-[#DECFC8] bg-white text-[#52606D] hover:border-[#B95347]'
                      }`}
                    >
                      Delivery
                    </button>
                  </div>
                </div>

                {mode === 'local' && (
                  <div>
                    <label
                      htmlFor="cart-table"
                      className="mb-1.5 block text-xs font-semibold text-[#334155]"
                    >
                      Número de mesa *
                    </label>
                    <input
                      id="cart-table"
                      type="text"
                      required
                      value={tableNumber}
                      onChange={(e) => {
                        setTableNumber(e.target.value);
                        setOrderMessage(null);
                      }}
                      placeholder="Ej: Mesa 12 / Salón Principal"
                      className="w-full rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2.5 text-sm text-[#1F2A33] placeholder-[#7B8794] focus:border-[#B95347] focus:outline-none"
                    />
                  </div>
                )}

                {mode === 'delivery' && (
                  <div>
                    <label
                      htmlFor="cart-address"
                      className="mb-1.5 block text-xs font-semibold text-[#334155]"
                    >
                      Dirección de entrega *
                    </label>
                    <input
                      id="cart-address"
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        setOrderMessage(null);
                      }}
                      placeholder="Calle, altura, piso / depto"
                      className="w-full rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2.5 text-sm text-[#1F2A33] placeholder-[#7B8794] focus:border-[#B95347] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="cart-notes"
                    className="mb-1.5 block text-xs font-semibold text-[#334155]"
                  >
                    Comentarios o aclaraciones (opcional)
                  </label>
                  <input
                    id="cart-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setOrderMessage(null);
                    }}
                    placeholder="Ej: Sin picante, horario de retiro, cubiertos..."
                    className="w-full rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2.5 text-sm text-[#1F2A33] placeholder-[#7B8794] focus:border-[#B95347] focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#B95347] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9E4237] cursor-pointer"
                >
                  Continuar por WhatsApp
                </button>
              </form>

              {orderMessage && (
                <div className="rounded-xl border border-[#A5D3C4] bg-[#EDF7F3] p-4">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#1D7A5F]"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1F2A33]">
                        Pedido preparado para WhatsApp
                      </p>
                      <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#334155]">
                        {orderMessage}
                      </pre>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-[#1F8A4C] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        >
                          <span>Enviar pedido ahora</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#DECFC8] bg-white px-3.5 py-2 text-xs font-medium text-[#1F2A33] hover:border-[#B95347] cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copied ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
