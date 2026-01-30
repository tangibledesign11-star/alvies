"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "./GlassSurface";

export interface Message {
	id: string;
	content: string;
	sender: "system" | "user";
}

interface ConversationLayerProps {
	messages: Message[];
	isExiting?: boolean;
}

/**
 * Conversation display using Apple-style subtle glass system.
 *
 * Material Philosophy:
 * - Subtle, near-invisible glass that prioritizes clarity
 * - Material presence without visual noise
 * - Text is always full opacity for guaranteed contrast
 *
 * Message Differentiation:
 * - AI vs User distinguished primarily by alignment (left vs right)
 * - Minimal tint variation (2-4%) — never dark vs light cards
 */
export function ConversationLayer({
	messages,
	isExiting = false,
}: ConversationLayerProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	if (messages.length === 0) {
		return null;
	}

	return (
		<div
			className={`
				fixed inset-x-0 bottom-24 top-0 flex flex-col justify-end px-5 md:px-6
				transition-opacity duration-500 ease-in-out
				${isExiting ? "opacity-0" : "opacity-100"}
			`}
		>
			{/* Top gradient mask — very subtle fade for scroll overflow */}
			<div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/30 to-transparent" />

			{/* Message container */}
			<div
				ref={containerRef}
				className="conversation-scroll mx-auto w-full max-w-xl cursor-default overflow-y-auto"
				style={{ maxHeight: "calc(100vh - 160px)" }}
			>
				<div className="flex flex-col gap-3 pb-4 pt-28">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`
								animate-fade-in
								flex
								${message.sender === "system" ? "justify-start" : "justify-end"}
							`}
						>
							{/* GlassSurface — unified material system */}
							<GlassSurface
								variant={message.sender === "system" ? "default" : "subtle"}
								className="max-w-[80%] px-4 py-2.5"
							>
								{/* Text at full opacity — non-negotiable */}
								<p className="text-[15px] font-normal leading-relaxed text-white">
									{message.content}
								</p>
							</GlassSurface>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
