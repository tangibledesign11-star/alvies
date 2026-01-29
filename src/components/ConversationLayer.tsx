"use client";

interface ConversationLayerProps {
  message: string | null;
}

/**
 * Minimal conversation display layer.
 * Shows only the most recent message with a fade-in animation.
 * Uses key-based remounting to trigger CSS animation on message change.
 *
 * Future enhancement: This could display AI responses alongside
 * user messages. Would need to track message history and sender.
 */
export function ConversationLayer({ message }: ConversationLayerProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-32 flex justify-center px-6">
      <p
        key={message}
        className="
          max-w-lg
          animate-fade-in
          text-center
          text-lg
          font-light
          tracking-wide
          text-white/80
        "
      >
        {message}
      </p>
    </div>
  );
}
