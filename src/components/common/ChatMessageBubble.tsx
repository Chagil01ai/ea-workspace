import React from "react";
import type { TutorMessage } from "../../types/tutor";

interface ChatMessageBubbleProps {
  message: TutorMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`chat ${
        isUser ? "chat-end" : "chat-start"
      } text-sm md:text-base`}
    >
      <div className="chat-image avatar">
        <div className="w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
          {isUser ? "You" : "EA"}
        </div>
      </div>
      <div className="chat-header text-[0.7rem] text-slate-400 mb-1">
        {isUser ? "You" : "EA Tutor"}
      </div>
      <div
        className={`chat-bubble whitespace-pre-wrap ${
          isUser
            ? "bg-sky-600 text-slate-50"
            : "bg-slate-800 text-slate-100 border border-slate-700"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessageBubble;
