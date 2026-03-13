'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: number; 
}
export function Avatar({ src, alt, size = 40 }: AvatarProps) {
  const [imgOk, setImgOk] = useState(true);

  const dimension = `${size}px`;
  const initials = alt?.charAt(0).toUpperCase() || '?';

  if (!src || !imgOk) {
    return (
      <div
        style={{ width: dimension, height: dimension }}
        className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shrink-0"
      >
        <span className="text-xs font-bold text-white">{initials}</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="relative rounded-full overflow-hidden shrink-0 bg-gray-200"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={dimension}
        onError={() => setImgOk(false)}
      />
    </div>
  );
}
