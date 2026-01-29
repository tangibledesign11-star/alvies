"use client";

import { useState, useCallback, KeyboardEvent, ChangeEvent } from "react";
import { Mic } from "lucide-react";

interface InputDockProps {
	onSubmit: (message: string) => void;
	placeholder?: string;
	disabled?: boolean;
	isExiting?: boolean;
}

/**
 * Input dock with consistent rounded rectangle shape language.
 * Mic button in its own rounded rectangle container.
 * Uses lucide-react for icons.
 *
 * Future enhancement: Connect speech-to-text when mic is active.
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
			className={`
				fixed bottom-0 left-0 right-0 p-6 pb-8
				transition-opacity duration-500 ease-in-out
				${isExiting ? "opacity-0" : "opacity-100"}
			`}
		>
			<div className="mx-auto flex max-w-xl items-center gap-3">
				{/* Input — rounded rectangle */}
				<input
					type="text"
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className={`
						flex-1
						cursor-text
						rounded-xl
						bg-black/50
						px-4 py-3
						text-[15px] font-normal leading-relaxed
						text-white
						placeholder:text-white/40
						caret-white/60
						backdrop-blur-md
						focus:bg-black/60
						focus:outline-none
						disabled:cursor-not-allowed
						disabled:opacity-0
					`}
					aria-label="Message input"
				/>

				{/* Mic button — rounded rectangle container */}
				<button
					type="button"
					onClick={handleMicClick}
					disabled={disabled}
					className={`
						flex h-[46px] w-[46px] cursor-pointer items-center justify-center
						rounded-xl
						bg-black/50
						backdrop-blur-xl
						transition-colors duration-300 ease-in-out
						hover:bg-black/60
						focus:bg-black/60
						focus:outline-none
						disabled:cursor-not-allowed
						disabled:opacity-0
					`}
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
							transition-colors duration-300
							${micPermission === "granted" ? "text-white" : "text-white/60"}
							${micPermission === "denied" ? "text-white/30" : ""}
						`}
					/>
				</button>
			</div>
		</div>
	);
}
