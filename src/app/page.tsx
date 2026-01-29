"use client";

import { useState, useCallback } from "react";
import {
  AmbientBackground,
  InputDock,
  ConversationLayer,
} from "@/components";

/**
 * Landing page for the luxury cowboy boots brand experience.
 *
 * This is intentionally minimal — a full-bleed ambient background
 * with a single input dock and conversation layer.
 *
 * Future enhancement: Connect AI logic here to process user messages
 * and generate contextual responses. The handleSubmit callback is
 * where that integration would occur.
 */
export default function Home() {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  const handleSubmit = useCallback((message: string) => {
    // Store the user's message to display
    setCurrentMessage(message);

    // Future: This is where AI processing would be triggered
    // Example: await processWithAI(message);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Cinematic ambient background */}
      <AmbientBackground />

      {/* Conversation display - shows most recent message */}
      <ConversationLayer message={currentMessage} />

      {/* Input dock at bottom */}
      <InputDock onSubmit={handleSubmit} />
    </main>
  );
}
