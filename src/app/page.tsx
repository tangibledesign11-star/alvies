"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AmbientBackground, InputDock, ConversationLayer } from "@/components";
import type { Message } from "@/components/ConversationLayer";

/**
 * Initial system message — founder-led, calm tone.
 */
const INITIAL_MESSAGE =
	"Welcome. We make boots for people who know where they're going.";

/**
 * Predefined AI responses — cycled through deterministically.
 * Calm, editorial tone. No sales language.
 */
const AI_RESPONSES = [
	"Every pair is made to last. That's the only way we know.",
	"Our leather comes from one tannery. We've worked with them for years.",
	"Some people walk. Some people arrive. We build for the latter.",
	"Let me show you something.",
];

/**
 * Maximum messages before transition.
 * Includes both system and user messages.
 */
const MAX_MESSAGES = 5;

/**
 * Fade-out duration in milliseconds.
 */
const EXIT_ANIMATION_DURATION = 600;

/**
 * Landing page with deterministic conversation flow.
 * After MAX_MESSAGES, fades out and transitions to /products.
 */
export default function Home() {
	const router = useRouter();

	const [messages, setMessages] = useState<Message[]>([]);
	const [inputEnabled, setInputEnabled] = useState(false);
	const [conversationComplete, setConversationComplete] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	const responseIndexRef = useRef(0);
	const messageCounterRef = useRef(0);
	const hasNavigatedRef = useRef(false);

	// Show initial system message after delay
	useEffect(() => {
		const timer = setTimeout(() => {
			setMessages([
				{
					id: "initial",
					content: INITIAL_MESSAGE,
					sender: "system",
				},
			]);

			// Enable input shortly after message appears
			setTimeout(() => {
				setInputEnabled(true);
			}, 400);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	// Detect conversation completion — set flag exactly once
	useEffect(() => {
		if (messages.length >= MAX_MESSAGES && !conversationComplete) {
			setConversationComplete(true);
		}
	}, [messages.length, conversationComplete]);

	// Handle exit animation and navigation — depends ONLY on conversationComplete
	useEffect(() => {
		if (!conversationComplete) return;
		if (hasNavigatedRef.current) return;

		// Mark as navigating immediately to prevent duplicate runs
		hasNavigatedRef.current = true;

		// Trigger visual exit state
		setIsExiting(true);
		setInputEnabled(false);

		// Navigate after animation completes
		const timer = setTimeout(() => {
			router.push("/products");
		}, EXIT_ANIMATION_DURATION);

		return () => clearTimeout(timer);
	}, [conversationComplete, router]);

	const handleSubmit = useCallback((content: string) => {
		// Generate unique ID using counter ref
		const userMessageId = `user-${messageCounterRef.current++}`;

		const userMessage: Message = {
			id: userMessageId,
			content,
			sender: "user",
		};

		// Add user message
		setMessages((prev) => [...prev, userMessage]);

		// Schedule AI response outside state updater to avoid duplicates
		const currentResponseIndex = responseIndexRef.current;
		responseIndexRef.current += 1;

		setTimeout(() => {
			setMessages((current) => {
				// Only add if we haven't reached max
				if (current.length >= MAX_MESSAGES) {
					return current;
				}

				const aiResponse: Message = {
					id: `system-${currentResponseIndex}`,
					content: AI_RESPONSES[currentResponseIndex % AI_RESPONSES.length],
					sender: "system",
				};

				return [...current, aiResponse];
			});
		}, 700);
	}, []);

	return (
		<main className="relative h-screen w-screen overflow-hidden">
			{/* Cinematic ambient background */}
			<AmbientBackground />

			{/* Conversation display */}
			<ConversationLayer messages={messages} isExiting={isExiting} />

			{/* Input dock at bottom */}
			<InputDock
				onSubmit={handleSubmit}
				disabled={!inputEnabled || isExiting}
				isExiting={isExiting}
			/>
		</main>
	);
}
