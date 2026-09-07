'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  HiBars3,
  HiChevronDown,
  HiMagnifyingGlass,
  HiMapPin,
  HiPhone,
  HiStar,
  HiXMark,
} from 'react-icons/hi2';
import { FiHeart, FiLogOut, FiPackage } from 'react-icons/fi';
import { CiUser } from 'react-icons/ci';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { useCart } from '@/contexts/CartContext';
import CartModal from '@/components/CartModal';
import MobileMenu from '@/components/MobileMenu';

import type { NavItem } from './Navbar/types';
import { fetchNavItems } from './Navbar/utils/api';

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
  const [popularProducts, setPopularProducts] = useState<
    { id: string; name: string; price: number; originalPrice?: number; image: string; badge?: string; slug: string; categorySlug: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; price: number; originalPrice?: number; image: string; badge?: string; slug: string; categorySlug: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchNavItems().then((data) => {
      if (data.length > 0) setNavItems(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetch(`/api/v1/products?sortBy=createdAt&sortOrder=desc&limit=6&isActive=true`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPopularProducts(
            json.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice ?? undefined,
              image: p.thumbnail || p.images?.[0] || '',
              badge: p.isBestSeller ? 'Best Seller' : p.isOnSale ? 'Sale' : p.isNew ? 'New' : undefined,
              slug: p.slug || String(p.id),
              categorySlug: p.category?.slug || 'products',
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/v1/products?search=${encodeURIComponent(value.trim())}&limit=6&isActive=true`
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSearchResults(
            json.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice ?? undefined,
              image: p.thumbnail || p.images?.[0] || '',
              badge: p.isBestSeller ? 'Best Seller' : p.isOnSale ? 'Sale' : p.isNew ? 'New' : undefined,
              slug: p.slug || String(p.id),
              categorySlug: p.category?.slug || 'products',
            }))
          );
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleCloseAllMenus = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
    setActiveDropdown(null);
    setIsSearchOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      {/* Navbar Wrapper - Sticky */}
      <div ref={(el) => {
        if (el) {
          const height = el.getBoundingClientRect().height;
          document.documentElement.style.setProperty('--navbar-height', `${height}px`);
        }
      }} className="sticky top-0 z-[60]">
      {/* Top Bar - Logo & Icons */}
      <div className={`bg-white border-b border-gray-200 transition-shadow ${isScrolled ? 'shadow-lg shadow-black/10' : ''}`}>
        <div className="max-w-9xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-14">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center lg:hidden gap-3">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <HiXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
              </button>
              <button
                type="button"
                className="text-zinc-600 hover:text-zinc-900 transition-colors p-1"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Search"
              >
                <HiMagnifyingGlass className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </div>

            {/* Center: Logo */}
            <Link
              href="/"
              className="flex items-center"
              onClick={handleCloseAllMenus}
            >
              <Image
                src="/logo.jpg"
                alt="Rapharch Logo"
                width={220}
                height={220}
                className="h-14 lg:h-16 w-auto object-cover"
                priority
              />
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              {/* Desktop Search */}
              <button
                type="button"
                className="hidden lg:block text-zinc-600 hover:text-zinc-900 transition-colors p-2"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Search"
              >
                <HiMagnifyingGlass className="h-5 w-5 lg:h-6 lg:w-6" />
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
                    className="flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors p-2"
                    aria-label="User menu"
                  >
                    <CiUser className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={0.5} />
                    <HiChevronDown className="h-3 w-3" />
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
                          <p className="text-base font-medium text-zinc-600 truncate">
                            {user?.firstName || user?.username}
                          </p>
                          <p className="text-sm text-zinc-600 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/dashboard/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-zinc-600 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <FiPackage className="h-5 w-5" strokeWidth={0.5} />
                            My Orders
                          </Link>
                          <Link
                            href="/rewards/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-zinc-600 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <HiStar className="h-5 w-5" />
                            Rewards
                          </Link>
                          <Link
                            href="/dashboard/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-zinc-600 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <FiHeart className="h-5 w-5" strokeWidth={0.5} />
                            Wishlist
                          </Link>
                          <Link
                            href="/dashboard/addresses"
                            className="flex items-center gap-3 px-4 py-2.5 text-base text-zinc-600 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <HiMapPin className="h-5 w-5" />
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
                            <FiLogOut className="h-5 w-5" strokeWidth={0.5} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block text-zinc-600 hover:text-zinc-900 transition-colors p-2"
                  onClick={handleCloseAllMenus}
                  aria-label="Login"
                >
                  <CiUser className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={0.5} />
                </Link>
              )}

              {/* Mobile User */}
              {isAuthenticated ? (
                <button
                  type="button"
                  className="md:hidden text-zinc-600 hover:text-zinc-900 transition-colors p-2"
                  onClick={logout}
                  aria-label="Logout"
                >
<CiUser className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={0.5} />
                        </button>
              ) : (
                <Link
                  href="/login"
                  className="md:hidden text-zinc-600 hover:text-zinc-600 transition-colors "
                  onClick={handleCloseAllMenus}
                  aria-label="Login"
                >
                  <CiUser className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={0.5} />
                </Link>
              )}

              {/* Cart */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="text-zinc-600 hover:text-zinc-900 transition-colors p-2"
                aria-label="Shopping cart"
              >
                <span className="text-sm font-medium tabular-nums">
                  Cart ({itemCount})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Navigation Items */}
      <div className="hidden lg:block bg-white relative py-2">
        <div className="max-w-9xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-10">
            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center justify-center gap-32 w-full">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="text-lg font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-3 inline-flex items-center gap-2"
                    onClick={handleCloseAllMenus}
                  >
                    {item.name}
                    {item.columns.length > 0 && (
                      <HiChevronDown className="h-4 w-4 transition-transform" />
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
            className="absolute left-0 right-0 bg-white shadow-xl z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                {navItems
                  .find((item) => item.name === activeDropdown)
                  ?.columns.map((column) => (
                    <div key={column.title}>
                      <Link
                        href={column.href || '#'}
                        className="text-base font-semibold text-zinc-600 uppercase tracking-wider mb-4 block hover:text-[#D4AF37] transition-colors"
                        onClick={handleCloseAllMenus}
                      >
                        {column.title}
                      </Link>
                      <ul className="space-y-3">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="text-base text-zinc-600 hover:text-zinc-900 transition-colors"
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
      </div>{/* End Navbar Wrapper */}

      {/* Mobile Sidebar */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={handleCloseAllMenus}
        navItems={navItems}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              className="relative bg-white border-b border-gray-200 z-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="relative">
                  <HiMagnifyingGlass className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-8 pr-12 py-2 text-lg bg-transparent text-zinc-600 focus:outline-none placeholder:text-zinc-600 border-b border-gray-200 focus:border-gray-900"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm font-medium text-zinc-600 hover:text-zinc-600 transition-colors px-1"
                    aria-label="Close search"
                  >
                    CLOSE
                  </button>
                </div>
                <div className="mt-4">
                  {searchQuery.trim() ? (
                    <>
                      <h3 className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-3">
                        {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
                      </h3>
                      {searchResults.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.categorySlug}/${product.slug}`}
                              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                              className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] flex flex-col p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 45vw) 45vw, (max-width: 30vw) 30vw, (max-width: 22vw) 22vw, 18vw"
                                />
                                {product.badge && (
                                  <span className="absolute top-0 left-0 text-[9px] font-bold uppercase px-1 py-0.5 rounded-br-md bg-[#D4AF37] text-white">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-zinc-600 truncate">{product.name}</p>
                                  <p className="text-sm font-semibold text-zinc-600 flex-shrink-0">${product.price}</p>
                                </div>
                                {product.originalPrice && product.originalPrice !== product.price && (
                                  <p className="text-xs text-zinc-600 line-through">${product.originalPrice}</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        !isSearching && <p className="text-sm text-zinc-600">No products found</p>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-3">
                        Popular Products
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        {popularProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.categorySlug}/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] flex flex-col p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 45vw) 45vw, (max-width: 30vw) 30vw, (max-width: 22vw) 22vw, 18vw"
                          />
                          {product.badge && (
                            <span className="absolute top-0 left-0 text-[9px] font-bold uppercase px-1 py-0.5 rounded-br-md bg-[#D4AF37] text-white">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-zinc-600 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm font-semibold text-zinc-600 flex-shrink-0">
                              ${product.price}
                            </p>
                          </div>
                          {product.originalPrice && product.originalPrice !== product.price && (
                            <p className="text-xs text-zinc-600 line-through">
                              ${product.originalPrice}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
