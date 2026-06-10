'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Star,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { useCart } from '@/contexts/CartContext';
import CartModal from '@/components/CartModal';

interface NavLink {
  label: string;
  href: string;
}

interface NavColumn {
  id: string;
  title: string;
  href: string;
  order: number;
  links: NavLink[];
}

interface NavItem {
  id: string;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  columns: NavColumn[];
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch('/api/v1/public/navigation/active');
        const data = await response.json();
        if (data.success && data.data) {
          setNavItems(data.data);
        }
      } catch {
        setNavItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  const handleCloseAllMenus = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
    setActiveDropdown(null);
    setIsSearchOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      {/* Top Bar - Logo & Icons */}
      <div className={`bg-white border-b border-gray-100 transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center lg:hidden gap-3">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-900 hover:text-gray-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="text-gray-900 hover:text-gray-600 transition-colors p-1"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Center: Logo */}
            <Link
              href="/"
              className="flex items-center"
              onClick={handleCloseAllMenus}
            >
              <Image
                src="/raphard-logo.png"
                alt="Rapharch Logo"
                width={160}
                height={160}
                className="h-10 lg:h-14 w-auto object-cover"
                priority
              />
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Desktop Search */}
              <button
                type="button"
                className="hidden lg:block text-gray-900 hover:text-gray-600 transition-colors p-2"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Wishlist */}
              <button
                type="button"
                className="text-gray-900 hover:text-gray-600 transition-colors p-2"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 text-gray-900 hover:text-gray-600 transition-colors p-2"
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5" strokeWidth={1.5} />
                    <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-base font-medium text-gray-900 truncate">
                            {user?.firstName || user?.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/dashboard/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Package className="h-5 w-5" strokeWidth={1.5} />
                            My Orders
                          </Link>
                          <Link
                            href="/rewards/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Star className="h-5 w-5" strokeWidth={1.5} />
                            Rewards
                          </Link>
                          <Link
                            href="/dashboard/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Heart className="h-5 w-5" strokeWidth={1.5} />
                            Wishlist
                          </Link>
                          <Link
                            href="/dashboard/addresses"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <MapPin className="h-5 w-5" strokeWidth={1.5} />
                            Addresses
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                          <button
                            type="button"
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              logout();
                            }}
                          >
                            <LogOut className="h-5 w-5" strokeWidth={1.5} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:block text-gray-900 hover:text-gray-600 transition-colors p-2"
                  onClick={handleCloseAllMenus}
                  aria-label="Login"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Link>
              )}

              {/* Mobile User */}
              {isAuthenticated ? (
                <button
                  type="button"
                  className="md:hidden text-gray-900 hover:text-gray-600 transition-colors p-2"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="md:hidden text-gray-900 hover:text-gray-600 transition-colors p-2"
                  onClick={handleCloseAllMenus}
                  aria-label="Login"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Link>
              )}

              {/* Cart */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="text-gray-900 hover:text-gray-600 transition-colors p-2 relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-sm rounded-full h-4 w-4 flex items-center justify-center text-sm">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Navigation Items */}
      <div className="hidden lg:block bg-white border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12">
            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center justify-center gap-8 w-full">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="text-base font-medium text-gray-900 hover:text-[#D4AF37] transition-colors py-3 inline-flex items-center gap-1"
                    onClick={handleCloseAllMenus}
                  >
                    {item.name}
                    {item.columns.length > 0 && (
                      <ChevronDown className="h-4 w-4 transition-transform" strokeWidth={1.5} />
                    )}
                  </Link>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* Desktop Mega Dropdown */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            className="fixed left-0 right-0 top-[7.5rem] bg-white shadow-xl z-40 border-t border-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                {navItems
                  .find((item) => item.name === activeDropdown)
                  ?.columns.map((column) => (
                    <div key={column.title}>
                      <Link
                        href={column.href || '#'}
                        className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-4 block hover:text-[#D4AF37] transition-colors"
                        onClick={handleCloseAllMenus}
                      >
                        {column.title}
                      </Link>
                      <ul className="space-y-3">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="text-base text-gray-600 hover:text-black transition-colors"
                              onClick={handleCloseAllMenus}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAllMenus}
            />

            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-[61] flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                duration: 0.35,
                ease: [0.32, 0, 0.67, 0],
              }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <Link href="/" onClick={handleCloseAllMenus}>
                  <Image
                    src="/icon.jpeg"
                    alt="RaphArch"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={handleCloseAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <AnimatePresence mode="wait">
                  {activeSubmenu ? (
                    <motion.div
                      key="submenu"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveSubmenu(null)}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5 hover:text-zinc-600 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                        Back
                      </button>

                      <p className="text-base font-semibold text-zinc-900 mb-5 uppercase tracking-wide">
                        {activeSubmenu}
                      </p>

                      <div className="space-y-6">
                        {navItems
                          .find((item) => item.name === activeSubmenu)
                          ?.columns.map((col) => (
                            <div key={col.title}>
                              <Link
                                href={col.href || '#'}
                                className="block text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3 hover:text-zinc-600 transition-colors"
                                onClick={handleCloseAllMenus}
                              >
                                {col.title}
                              </Link>
                              <div className="space-y-2.5">
                                {col.links.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-base text-zinc-800 hover:text-black transition-colors"
                                    onClick={handleCloseAllMenus}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="main"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-0.5">
                        {navItems.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => item.columns.length > 0 ? setActiveSubmenu(item.name) : handleCloseAllMenus()}
                            className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-colors text-left"
                          >
                            <span className="text-base font-medium text-zinc-800">{item.name}</span>
                            {item.columns.length > 0 && <ChevronRight className="h-4 w-4 text-zinc-300" strokeWidth={1.5} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-zinc-100 px-5 py-4 space-y-3">
                <Link
                  href="/contact-us"
                  className="flex items-center gap-3 px-3 py-2.5 text-base text-zinc-600 hover:text-black rounded-lg hover:bg-zinc-50 transition-colors"
                  onClick={handleCloseAllMenus}
                >
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                  Contact Us
                </Link>
                <Link
                  href="/stores"
                  className="flex items-center gap-3 px-3 py-2.5 text-base text-zinc-600 hover:text-black rounded-lg hover:bg-zinc-50 transition-colors"
                  onClick={handleCloseAllMenus}
                >
                  <MapPin className="h-5 w-5" strokeWidth={1.5} />
                  Find a Store
                </Link>
                <a
                  href="https://wa.me/1234567890?text=Hi%20RaphArch%2C%20I%20have%20a%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 text-base text-zinc-600 hover:text-black rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  Chat with us
                </a>
              </div>

              <div className="border-t border-zinc-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4 text-zinc-600" strokeWidth={1.5} />
                  </button>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={logout}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="h-4 w-4 text-zinc-600" strokeWidth={1.5} />
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={handleCloseAllMenus}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                      aria-label="Login"
                    >
                      <User className="h-4 w-4 text-zinc-600" strokeWidth={1.5} />
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { handleCloseAllMenus(); setIsCartOpen(true); }}
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-4 w-4 text-zinc-600" strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-zinc-900 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 h-[50vh]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Search
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-600 hover:text-black"
                  aria-label="Close search"
                >
                  <X className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-12 pr-4 py-3 border-b border-gray-300 text-xl focus:outline-none focus:border-black placeholder:text-gray-500"
                  autoFocus
                />
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Shoes',
                    'Hoodies',
                    'T-Shirts',
                    'Jeans',
                    'Sneakers',
                    'Jackets',
                    'Shorts',
                    'Sweaters',
                  ].map((item) => (
                    <button
                      type="button"
                      key={item}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
