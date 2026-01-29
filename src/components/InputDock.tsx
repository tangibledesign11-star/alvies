"use client";

import { useState, useCallback, KeyboardEvent, ChangeEvent } from "react";

interface InputDockProps {
	onSubmit: (message: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

/**
 * Glassmorphism-styled input dock for the bottom of the viewport.
 * Designed to feel calm and concierge-like.
 *
 * Future enhancement: This is where AI logic would connect.
 * The onSubmit callback could trigger an API call or state update
 * that processes the user's message.
 */
export function InputDock({
	onSubmit,
	placeholder = "Where are you headed?",
	disabled = false,
}: InputDockProps) {
	const [value, setValue] = useState("");

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	}, []);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && value.trim() && !disabled) {
				onSubmit(value.trim());
				setValue("");
			}
		},
		[value, onSubmit, disabled]
	);

	return (
		<div className="fixed bottom-0 left-0 right-0 p-6 pb-10">
			<div className="mx-auto max-w-xl">
				<input
					type="text"
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="
						w-full
						rounded-2xl
						border border-white/[0.08]
						bg-neutral/[0.80]
						px-6 py-4
						text-base text-white/85
						placeholder:text-white/45
						backdrop-blur-xl
						focus:border-white/[0.20]
						focus:bg-white/[0.06]
						focus:outline-none
						disabled:cursor-not-allowed
						disabled:opacity-50
					"
					aria-label="Message input"
				/>
			</div>
		</div>
	);
}
