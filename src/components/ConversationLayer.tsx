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
 * Note: Opacity transitions on parent elements break backdrop-filter.
 * We use visibility + opacity on a separate overlay for exit animations,
 * keeping the glass surfaces unaffected.
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
		<div className="fixed inset-x-0 bottom-24 top-0 flex flex-col justify-end px-5 md:px-6">
			{/* Exit overlay - separate from glass surfaces to not break backdrop-filter */}
			{isExiting && (
				<div className="pointer-events-none absolute inset-0 z-50 bg-black/0 animate-fade-out" />
			)}

			{/* Top gradient mask */}
			<div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/30 to-transparent" />

			{/* Message container */}
			<div
				ref={containerRef}
				className="conversation-scroll mx-auto w-full max-w-xl cursor-default overflow-y-auto"
				style={{
					maxHeight: "calc(100vh - 160px)",
					visibility: isExiting ? "hidden" : "visible",
				}}
			>
				<div className="flex flex-col gap-3 pb-4 pt-28">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === "system" ? "justify-start" : "justify-end"}`}
						>
							<GlassSurface
								variant={message.sender === "system" ? "default" : "subtle"}
								className="max-w-[80%] px-4 py-2.5 animate-message-in"
							>
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
