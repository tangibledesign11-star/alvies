"use client";

import Image from "next/image";
import { useState } from "react";

interface AmbientBackgroundProps {
  src?: string;
  alt?: string;
}

/**
 * Full-bleed ambient background component.
 * Renders a cinematic, dark-toned background with layered subtle overlays.
 * Falls back to a gradient if no image is available.
 *
 * Future enhancement: Could accept dynamic image sources based on
 * conversation context or time of day.
 */
export function AmbientBackground({
  src = "/ambient-bg.jpg",
  alt = "Ambient background",
}: AmbientBackgroundProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base: Either image or fallback gradient */}
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={() => setImageError(true)}
        />
      ) : (
        // Cinematic fallback — muted earth tones, low contrast
        <div
          className="absolute inset-0 bg-[#0c0a09]"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% 0%, rgba(38, 32, 28, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 85% 60%, rgba(45, 38, 32, 0.3) 0%, transparent 40%),
              radial-gradient(ellipse 90% 70% at 15% 75%, rgba(32, 28, 25, 0.4) 0%, transparent 45%),
              #0c0a09
            `,
          }}
        />
      )}

      {/* Depth layer 1: Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.3) 100%)",
        }}
      />

      {/* Depth layer 2: Bottom fade for input dock area */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 25%, transparent 50%)",
        }}
      />

      {/* Depth layer 3: Top edge softening */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 20%)",
        }}
      />

      {/* Subtle film grain — nearly imperceptible */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
