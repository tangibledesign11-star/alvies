"use client";

import { useState, useCallback } from "react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { InputDock } from "@/components/InputDock";
import { ProductCarousel, type Product } from "@/components/ProductCarousel";
import { ProductDetail } from "@/components/ProductDetail";

/**
 * Product data — images can be easily swapped later.
 */
const PRODUCTS: Product[] = [
	{
		id: "1",
		name: "The Austin",
		image: "/products/product-image-1.png",
	},
	{
		id: "2",
		name: "The Dallas",
		image: "/products/product-image-2.png",
	},
	{
		id: "3",
		name: "The Houston",
		image: "/products/product-image-3.png",
	},
	{
		id: "4",
		name: "The San Antonio",
		image: "/products/product-image-4.png",
	},
	{
		id: "5",
		name: "The Fort Worth",
		image: "/products/product-image-5.png",
	},
];

/**
 * Products page with vertical carousel and selected product display.
 *
 * Layout:
 * - Full-bleed background (ambient-bg-2.webp)
 * - Left 30%: vertical product carousel (centered)
 * - Right 70%: selected product detail (centered)
 * - Bottom: chat input (reused from landing)
 */
export default function ProductsPage() {
	const [activeIndex, setActiveIndex] = useState(0);

	const handleProductSelect = useCallback((index: number) => {
		setActiveIndex(index);
	}, []);

	const handleChatSubmit = useCallback((message: string) => {
		// Chat functionality to be implemented
		console.log("Chat message:", message);
	}, []);

	const activeProduct = PRODUCTS[activeIndex];

	return (
		<main className="relative h-screen w-screen overflow-hidden">
			{/* Background — products page uses ambient-bg-2 */}
			<AmbientBackground src="/ambient-bg-2.webp" />

			{/* Main content area — split layout */}
			<div className="relative h-full w-full flex">
				{/* Left side: Product carousel (30%) — centered */}
				<div className="w-[30%] h-full flex-shrink-0">
					<ProductCarousel
						products={PRODUCTS}
						activeIndex={activeIndex}
						onSelect={handleProductSelect}
					/>
				</div>

				{/* Right side: Selected product (70%) — centered */}
				<div className="w-[70%] h-full">
					<ProductDetail product={activeProduct} />
				</div>
			</div>

			{/* Chat input — bottom center */}
			<InputDock
				onSubmit={handleChatSubmit}
				placeholder="Ask about this boot…"
			/>
		</main>
	);
}
