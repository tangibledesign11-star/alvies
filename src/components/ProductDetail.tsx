"use client";

import Image from "next/image";
import type { Product } from "./ProductCarousel";

interface ProductDetailProps {
	product: Product | null;
}

/**
 * Selected product display for the right side of the products screen.
 * - Radial progressive blur behind product (center to edge)
 * - Product image displayed without rectangular background
 * - Horizontally centered
 */
export function ProductDetail({ product }: ProductDetailProps) {
	if (!product) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<p className="text-white/40 text-sm">Select a product</p>
			</div>
		);
	}

	return (
		<div className="h-full w-full flex items-center justify-center">
			{/* Radial progressive blur — strongest at center, fades to edges */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					WebkitBackdropFilter: "blur(60px) saturate(1.2)",
					backdropFilter: "blur(60px) saturate(1.2)",
					WebkitMaskImage: `
						radial-gradient(
							ellipse 45% 45% at 65% 50%,
							black 0%,
							rgba(0,0,0,0.6) 30%,
							rgba(0,0,0,0.2) 60%,
							transparent 100%
						)
					`,
					maskImage: `
						radial-gradient(
							ellipse 45% 45% at 65% 50%,
							black 0%,
							rgba(0,0,0,0.6) 30%,
							rgba(0,0,0,0.2) 60%,
							transparent 100%
						)
					`,
				}}
			/>

			{/* Product image — centered, no rectangular background */}
			<div className="relative w-full max-w-md aspect-square">
				<Image
					src={product.image}
					alt={product.name}
					fill
					className="object-contain animate-product-in"
					sizes="(max-width: 768px) 100vw, 448px"
					priority
				/>
			</div>
		</div>
	);
}
