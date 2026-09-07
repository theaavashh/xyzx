'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

interface StoreData {
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
}

export function FooterContact() {
  const [store, setStore] = useState<StoreData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/store-section/public`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.data) setStore(json.data);
      })
      .catch(() => {});
  }, []);

  const fullAddress = [store?.address, store?.city, store?.state, store?.zip]
    .filter(Boolean)
    .join(', ');
  const phone = store?.phone;
  const email = store?.email;

  if (!fullAddress && !phone && !email) return null;

  return (
    <div className="py-6 sm:py-8 border-t border-gray-300">
      <h4 className="swansea text-base lg:text-lg font-extrabold text-zinc-900 tracking-wider uppercase mb-3">
        Contact Details
      </h4>
      <ul className="space-y-2 lg:space-y-3">
        {fullAddress && (
          <li className="flex items-start gap-2 text-base lg:text-xl text-zinc-600">
            <MapPin className="w-4 h-4 mt-1 shrink-0" />
            <span>{fullAddress}</span>
          </li>
        )}
        {phone && (
          <li className="flex items-center gap-2 text-base lg:text-xl text-zinc-600">
            <Phone className="w-4 h-4 shrink-0" />
            <a href={`tel:${phone}`} className="hover:opacity-60 transition-opacity">
              {phone}
            </a>
          </li>
        )}
        {email && (
          <li className="flex items-center gap-2 text-base lg:text-xl text-zinc-600">
            <Mail className="w-4 h-4 shrink-0" />
            <a href={`mailto:${email}`} className="hover:opacity-60 transition-opacity">
              {email}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
