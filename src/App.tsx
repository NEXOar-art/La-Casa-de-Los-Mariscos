import { useEffect, useState } from 'react';
import {
  DEFAULT_MENU_ITEMS,
  DEFAULT_RESTAURANT_INFO,
  MenuItem,
  RestaurantInfo,
} from './data/restaurantData';
import { ThreeOceanCanvas } from './components/ThreeOceanCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { CartDrawer, CartEntry } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { LocationFooter } from './components/LocationFooter';

const STORAGE_MENU_KEY = 'marisqueria_menu_v1';
const STORAGE_INFO_KEY = 'lacasadelosmariscos_info_v3';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MENU_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every(
            (item) =>
              item &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.description === 'string' &&
              typeof item.price === 'number' &&
              Number.isFinite(item.price) &&
              typeof item.category === 'string'
          )
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INFO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return {
            ...DEFAULT_RESTAURANT_INFO,
            ...parsed,
            reviewCount:
              typeof parsed.reviewCount === 'number' &&
              Number.isFinite(parsed.reviewCount)
                ? parsed.reviewCount
                : DEFAULT_RESTAURANT_INFO.reviewCount,
          };
        }
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_RESTAURANT_INFO;
  });

  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MENU_KEY, JSON.stringify(menuItems));
    } catch {
      // ignore storage errors
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INFO_KEY, JSON.stringify(restaurantInfo));
    } catch {
      // ignore storage errors
    }
  }, [restaurantInfo]);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const nextQty = (prev[id] || 0) + delta;
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[id];
      } else {
        next[id] = nextQty;
      }
      return next;
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleClearCart = () => setCart({});

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const handleResetMenu = () => {
    setMenuItems(DEFAULT_MENU_ITEMS);
  };

  const cartEntries: CartEntry[] = menuItems
    .filter((item) => (cart[item.id] || 0) > 0)
    .map((item) => ({
      item,
      quantity: cart[item.id],
    }));

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  return (
    <div className="relative min-h-screen bg-[#FBF8F5] text-[#1F2A33]">
      <ThreeOceanCanvas />

      <Navbar
        restaurantName={restaurantInfo.name}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <HeroSection info={restaurantInfo} />
        <GallerySection />
        <MenuSection
          items={menuItems}
          cartQuantities={cart}
          isAdmin={isAdmin}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setCartOpen(true)}
          onRequestAdminLogin={() => setAdminModalOpen(true)}
          onExitAdmin={() => setIsAdmin(false)}
          onUpdatePrice={handleUpdatePrice}
          onResetMenu={handleResetMenu}
        />
        <ReservationSection info={restaurantInfo} />
      </main>

      <LocationFooter
        info={restaurantInfo}
        onRequestAdmin={() => setAdminModalOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        entries={cartEntries}
        info={restaurantInfo}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <AdminModal
        open={adminModalOpen}
        isAdmin={isAdmin}
        info={restaurantInfo}
        onClose={() => setAdminModalOpen(false)}
        onUnlock={() => setIsAdmin(true)}
        onUpdateInfo={(next) => setRestaurantInfo(next)}
      />
    </div>
  );
}
