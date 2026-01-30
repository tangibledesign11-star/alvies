"use client";

import { forwardRef, ReactNode, HTMLAttributes } from "react";

/**
 * Apple-style Glass Surface Primitive
 *
 * Design Philosophy:
 * - Subtle, near-invisible glass that prioritizes clarity and restraint
 * - NOT Vision OS glass, NOT dark frosted panels
 * - Material presence without visual noise
 *
 * Surface Properties:
 * - Very light, neutral (white-based) tint at 6-12% opacity
 * - Low-strength backdrop blur (8px) — never relied upon alone for contrast
 * - Hairline border for quiet edge definition
 * - Very soft shadow for subtle layering
 *
 * Text Rules (non-negotiable):
 * - All text inside must be full opacity
 * - Contrast guaranteed by the surface, not the background
 */

export type GlassSurfaceVariant = "default" | "subtle";

interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: GlassSurfaceVariant;
	as?: "div" | "button";
	rounded?: "lg" | "xl" | "2xl" | "full";
}

/**
 * Reusable glass surface primitive.
 *
 * Variants:
 * - default: Primary glass surface (~10% white tint)
 * - subtle: Slightly lighter variant (~8% white tint) for secondary elements
 *
 * The difference is intentionally minimal (2-4%) to maintain visual cohesion.
 */
export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
	(
		{ children, variant = "default", as = "div", rounded = "2xl", className = "", ...props },
		ref
	) => {
		const Component = as;

		// Base glass properties — consistent across all uses
		const baseStyles = `
			backdrop-blur-[8px]
			backdrop-saturate-[0.92]
			border
			border-white/[0.08]
			shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_0.5px_rgba(255,255,255,0.04)_inset]
		`;

		// Variant-specific tint — minimal differentiation
		const variantStyles = {
			default: "bg-white/[0.10]",
			subtle: "bg-white/[0.08]",
		};

		// Border radius options
		const roundedStyles = {
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			full: "rounded-full",
		};

		return (
			<Component
				ref={ref}
				className={`
					${baseStyles}
					${variantStyles[variant]}
					${roundedStyles[rounded]}
					${className}
				`}
				{...props}
			>
				{children}
			</Component>
		);
	}
);

GlassSurface.displayName = "GlassSurface";

/**
 * Glass surface for interactive elements (inputs, buttons).
 * Includes hover and focus states that maintain the glass aesthetic.
 */
interface GlassInteractiveProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	rounded?: "lg" | "xl" | "2xl" | "full";
	disabled?: boolean;
}

export const GlassInteractive = forwardRef<HTMLDivElement, GlassInteractiveProps>(
	({ children, rounded = "2xl", disabled = false, className = "", ...props }, ref) => {
		const roundedStyles = {
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			full: "rounded-full",
		};

		return (
			<div
				ref={ref}
				className={`
					backdrop-blur-[8px]
					backdrop-saturate-[0.92]
					border
					border-white/[0.08]
					shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_0.5px_rgba(255,255,255,0.04)_inset]
					bg-white/[0.10]
					${roundedStyles[rounded]}
					transition-[background-color,border-color] duration-200 ease-out
					${!disabled ? "hover:bg-white/[0.14] hover:border-white/[0.12]" : ""}
					${!disabled ? "focus-within:bg-white/[0.14] focus-within:border-white/[0.12]" : ""}
					${disabled ? "opacity-40 cursor-not-allowed" : ""}
					${className}
				`}
				{...props}
			>
				{children}
			</div>
		);
	}
);

GlassInteractive.displayName = "GlassInteractive";
