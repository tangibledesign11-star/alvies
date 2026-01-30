"use client";

import { forwardRef, ReactNode, HTMLAttributes, CSSProperties } from "react";

/**
 * Apple-style Glass Surface Primitive
 *
 * Uses inline styles for backdrop-filter to guarantee the effect
 * is always applied, even during React re-renders and hydration.
 */

export type GlassSurfaceVariant = "default" | "subtle";

interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: GlassSurfaceVariant;
	rounded?: "lg" | "xl" | "2xl" | "full";
}

// Glass styles applied inline to guarantee they're always present
const glassBaseStyle: CSSProperties = {
	position: "relative",
	isolation: "isolate",
	transform: "translateZ(0)",
	WebkitBackdropFilter: "blur(20px) saturate(1.1)",
	backdropFilter: "blur(20px) saturate(1.1)",
	willChange: "backdrop-filter",
	WebkitBackfaceVisibility: "hidden",
	backfaceVisibility: "hidden",
};

const glassVariantStyles: Record<GlassSurfaceVariant, CSSProperties> = {
	default: {
		backgroundColor: "rgba(255, 255, 255, 0.10)",
		border: "1px solid rgba(255, 255, 255, 0.12)",
		boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), inset 0 0 0 0.5px rgba(255, 255, 255, 0.06)",
	},
	subtle: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		border: "1px solid rgba(255, 255, 255, 0.10)",
		boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), inset 0 0 0 0.5px rgba(255, 255, 255, 0.06)",
	},
};

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
	({ children, variant = "default", rounded = "2xl", className = "", style, ...props }, ref) => {
		const roundedStyles = {
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			full: "rounded-full",
		};

		return (
			<div
				ref={ref}
				className={`${roundedStyles[rounded]} ${className}`}
				style={{
					...glassBaseStyle,
					...glassVariantStyles[variant],
					...style,
				}}
				{...props}
			>
				{children}
			</div>
		);
	}
);

GlassSurface.displayName = "GlassSurface";

/**
 * Glass surface for interactive elements (inputs, buttons).
 */
interface GlassInteractiveProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	rounded?: "lg" | "xl" | "2xl" | "full";
	disabled?: boolean;
}

const glassInteractiveStyle: CSSProperties = {
	...glassBaseStyle,
	backgroundColor: "rgba(255, 255, 255, 0.10)",
	border: "1px solid rgba(255, 255, 255, 0.12)",
	boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), inset 0 0 0 0.5px rgba(255, 255, 255, 0.06)",
	transition: "background-color 200ms ease-out, border-color 200ms ease-out",
};

export const GlassInteractive = forwardRef<HTMLDivElement, GlassInteractiveProps>(
	({ children, rounded = "2xl", disabled = false, className = "", style, ...props }, ref) => {
		const roundedStyles = {
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			full: "rounded-full",
		};

		return (
			<div
				ref={ref}
				className={`glass-interactive ${roundedStyles[rounded]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
				style={{
					...glassInteractiveStyle,
					...style,
				}}
				{...props}
			>
				{children}
			</div>
		);
	}
);

GlassInteractive.displayName = "GlassInteractive";
