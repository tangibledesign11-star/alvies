"use client";

import { useState, useCallback, KeyboardEvent, ChangeEvent } from "react";
import { Mic } from "lucide-react";
import { GlassInteractive } from "./GlassSurface";

interface InputDockProps {
	onSubmit: (message: string) => void;
	placeholder?: string;
	disabled?: boolean;
	isExiting?: boolean;
}

/**
 * Input dock using Apple-style subtle glass system.
 *
 * Note: Avoids opacity transitions on container as they break backdrop-filter.
 * Uses visibility for exit state instead.
 */
export function InputDock({
	onSubmit,
	placeholder = "Type here…",
	disabled = false,
	isExiting = false,
}: InputDockProps) {
	const [value, setValue] = useState("");
	const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");

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

	const handleMicClick = useCallback(async () => {
		if (disabled) return;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.getTracks().forEach((track) => track.stop());
			setMicPermission("granted");
		} catch {
			setMicPermission("denied");
		}
	}, [disabled]);

	return (
		<div
			className="fixed bottom-0 left-0 right-0 px-5 pt-6 pb-8 md:px-6"
			style={{ visibility: isExiting ? "hidden" : "visible" }}
		>
			<div className="mx-auto flex max-w-xl items-center gap-2.5">
				{/* Input — GlassInteractive surface */}
				<GlassInteractive className="flex-1" disabled={disabled}>
					<input
						type="text"
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled}
						className="
							w-full
							bg-transparent
							px-4 py-3
							text-[15px] font-normal leading-relaxed
							text-white
							placeholder:text-white/40
							caret-white/70
							focus:outline-none
							disabled:cursor-not-allowed
						"
						aria-label="Message input"
					/>
				</GlassInteractive>

				{/* Mic button — GlassInteractive surface */}
				<GlassInteractive disabled={disabled}>
					<button
						type="button"
						onClick={handleMicClick}
						disabled={disabled}
						className="
							flex h-[46px] w-[46px] cursor-pointer items-center justify-center
							bg-transparent
							focus:outline-none
							disabled:cursor-not-allowed
						"
						aria-label={
							micPermission === "granted"
								? "Microphone enabled"
								: micPermission === "denied"
									? "Microphone denied"
									: "Enable microphone"
						}
					>
						<Mic
							size={18}
							strokeWidth={1.5}
							className={`
								transition-colors duration-200
								${micPermission === "granted" ? "text-white" : "text-white/60"}
								${micPermission === "denied" ? "text-white/30" : ""}
							`}
						/>
					</button>
				</GlassInteractive>
			</div>
		</div>
	);
}
