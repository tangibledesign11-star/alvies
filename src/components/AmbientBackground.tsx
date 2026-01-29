"use client";

import Image from "next/image";
import { useState } from "react";

interface AmbientBackgroundProps {
	src?: string;
	alt?: string;
}

/**
 * Full-bleed ambient background with contrast-reliable overlay system.
 * The gradient overlay is always present, ensuring readability
 * regardless of background image brightness or contrast.
 *
 * Future enhancement: Could accept dynamic image sources based on
 * conversation context or time of day.
 */
export function AmbientBackground({
	src = "/ambient-bg.jpg",
	alt = "Ambient background",
}: AmbientBackgroundProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);

	return (
		<div className="fixed inset-0 -z-10">
			{/* Base color — always present, visible during load */}
			<div className="absolute inset-0 bg-[#080706]" />

			{/* Background image layer — fades in on load */}
			{!imageError && (
				<div
					className={`
						absolute inset-0
						transition-opacity duration-[800ms] ease-out
						${imageLoaded ? "opacity-100" : "opacity-0"}
					`}
				>
					<Image
						src={src}
						alt={alt}
						fill
						priority
						className="object-cover blur-[2px]"
						sizes="100vw"
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageError(true)}
					/>
				</div>
			)}

			{/* Fallback gradient — visible when no image */}
			{imageError && (
				<div
					className="absolute inset-0"
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

			{/* === CONTRAST OVERLAY SYSTEM === */}
			{/* Always present, above image, below UI */}

			{/* Primary contrast layer: Bottom-to-top gradient */}
			{/* Ensures input and messages are always readable */}
			<div
				className="absolute inset-0"
				style={{
					background: `linear-gradient(
						to top,
						rgba(0, 0, 0, 0.85) 0%,
						rgba(0, 0, 0, 0.7) 12%,
						rgba(0, 0, 0, 0.45) 28%,
						rgba(0, 0, 0, 0.2) 45%,
						transparent 60%
					)`,
				}}
			/>

			{/* Soft vignette — draws focus to center-bottom */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 90% 80% at 50% 60%, transparent 30%, rgba(0, 0, 0, 0.4) 100%)",
				}}
			/>

			{/* Top edge softening */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, transparent 15%)",
				}}
			/>

			{/* Subtle film grain — nearly imperceptible */}
			<div
				className="absolute inset-0 opacity-[0.012] mix-blend-overlay"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>
		</div>
	);
}
