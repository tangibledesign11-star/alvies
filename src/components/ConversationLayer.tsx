"use client";

import { useEffect, useRef } from "react";

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
 * Conversation display with rounded rectangle message containers.
 * Full opacity text with semi-opaque backgrounds for contrast.
 * AI messages: left, darker bg. User messages: right, lighter bg.
 *
 * Future enhancement: Connect to AI service for dynamic responses.
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
				fixed inset-x-0 bottom-24 top-0 flex flex-col justify-end px-6
				transition-opacity duration-500 ease-in-out
				${isExiting ? "opacity-0" : "opacity-100"}
			`}
		>
			{/* Top gradient mask for scroll overflow */}
			<div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

			{/* Message container */}
			<div
				ref={containerRef}
				className="conversation-scroll mx-auto w-full max-w-xl cursor-default overflow-y-auto"
				style={{ maxHeight: "calc(100vh - 160px)" }}
			>
				<div className="flex flex-col gap-3 pb-4 pt-36">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`
								animate-fade-in
								flex
								${message.sender === "system" ? "justify-start" : "justify-end"}
							`}
						>
							{/* Rounded rectangle message container — light padding, semi-opaque bg */}
							<div
								className={`
									max-w-[80%]
									rounded-xl
									px-4 py-2.5
									backdrop-blur-xl
									${
										message.sender === "system"
											? "bg-black/50"
											: "bg-white/[0.12]"
									}
								`}
							>
								<p className="text-[15px] font-normal leading-relaxed text-white">
									{message.content}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
