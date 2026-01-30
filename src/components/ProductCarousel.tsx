"use client";

import { useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { GlassSurface } from "./GlassSurface";

export interface Product {
	id: string;
	name: string;
	image: string;
	description?: string;
}

interface ProductCarouselProps {
	products: Product[];
	activeIndex: number;
	onSelect: (index: number) => void;
}

/**
 * Vertical product carousel showing 3 items at a time.
 * - Active item is centered, larger, and shows product name
 * - Non-active items are smaller, no name displayed, full opacity
 * - Smooth scroll navigation via trackpad/wheel
 */
export function ProductCarousel({
	products,
	activeIndex,
	onSelect,
}: ProductCarouselProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollAccumulator = useRef(0);
	const isScrolling = useRef(false);
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleProductClick = useCallback(
		(index: number) => {
			onSelect(index);
		},
		[onSelect]
	);

	// Smooth scroll handling with accumulation and debouncing
	const handleWheel = useCallback(
		(e: WheelEvent) => {
			e.preventDefault();

			// Accumulate scroll delta
			scrollAccumulator.current += e.deltaY;

			// Clear existing timeout
			if (scrollTimeout.current) {
				clearTimeout(scrollTimeout.current);
			}

			// Threshold for triggering navigation
			const threshold = 50;

			if (!isScrolling.current && Math.abs(scrollAccumulator.current) > threshold) {
				isScrolling.current = true;

				if (scrollAccumulator.current > 0 && activeIndex < products.length - 1) {
					onSelect(activeIndex + 1);
				} else if (scrollAccumulator.current < 0 && activeIndex > 0) {
					onSelect(activeIndex - 1);
				}

				// Reset accumulator
				scrollAccumulator.current = 0;

				// Debounce to prevent rapid firing
				scrollTimeout.current = setTimeout(() => {
					isScrolling.current = false;
				}, 300);
			}

			// Reset accumulator after inactivity
			scrollTimeout.current = setTimeout(() => {
				scrollAccumulator.current = 0;
			}, 150);
		},
		[activeIndex, products.length, onSelect]
	);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener("wheel", handleWheel, { passive: false });
			return () => {
				container.removeEventListener("wheel", handleWheel);
				if (scrollTimeout.current) {
					clearTimeout(scrollTimeout.current);
				}
			};
		}
	}, [handleWheel]);

	// Card dimensions
	const activeSize = 180;
	const inactiveSize = 140;
	const gap = 24;

	return (
		<div
			ref={containerRef}
			className="relative h-full w-full flex items-center justify-center"
		>
			{/* Carousel track — centered vertically and horizontally */}
			<div className="relative flex flex-col items-center justify-center">
				{products.map((product, index) => {
					const isActive = index === activeIndex;
					const offset = index - activeIndex;

					// Position relative to center
					const spacing = inactiveSize + gap;
					const translateY = offset * spacing;

					// Scale based on active state
					const scale = isActive ? 1 : 0.85;

					// Full opacity for all visible items, fade only far items
					const opacity = Math.abs(offset) > 2 ? 0 : 1;
					const zIndex = 10 - Math.abs(offset);

					// Size
					const size = isActive ? activeSize : inactiveSize;

					return (
						<div
							key={product.id}
							className="absolute cursor-pointer"
							style={{
								width: size,
								height: size,
								transform: `translateY(${translateY}px) scale(${scale})`,
								opacity,
								zIndex,
								transition: "transform 300ms ease-out, opacity 300ms ease-out, width 300ms ease-out, height 300ms ease-out",
							}}
							onClick={() => handleProductClick(index)}
						>
							<GlassSurface
								variant={isActive ? "default" : "subtle"}
								className="w-full h-full overflow-hidden"
							>
								<div className="relative w-full h-full">
									<Image
										src={product.image}
										alt={product.name}
										fill
										className="object-cover"
										sizes="180px"
									/>

									{/* Name overlay — only on active item */}
									{isActive && (
										<>
											<div
												className="absolute inset-0"
												style={{
													background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
												}}
											/>
											<div className="absolute bottom-0 left-0 right-0 p-3">
												<p className="text-white text-sm font-medium truncate">
													{product.name}
												</p>
											</div>
										</>
									)}
								</div>
							</GlassSurface>
						</div>
					);
				})}
			</div>
		</div>
	);
}
