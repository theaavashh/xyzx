'use client';

import { memo, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

const DEFAULT_DESCRIPTION =
  'RaphArch is a premium fashion house crafting elevated streetwear, footwear, and accessories. Thoughtfully designed pieces made to last — where modern silhouettes meet timeless quality.';

function ShortDescription() {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/v1/short-description`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.data?.description) {
          setDescription(json.data.description);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 md:py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm md:text-base leading-relaxed text-zinc-600 font-light">
          {description}
        </p>
      </div>
    </section>
  );
}

export default memo(ShortDescription);
