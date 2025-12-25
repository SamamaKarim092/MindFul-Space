"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import { useMood } from "@/app/context/MoodContext";

// GraphQL queries and mutations
const GET_CHAT = gql`
  query GetChat($chatId: String!) {
    chat(chatId: $chatId) {
      id
      title
      messages {
        id
        role
        content
        createdAt
      }
    }
  }
`;

const GET_ENTRY = gql`
  query GetEntry($id: String!) {
    entry(id: $id) {
      id
      title
      content
      moodLabels
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      title
      messages {
        id
        role
        content
        createdAt
      }
    }
  }
`;

const START_CONTEXTUAL_CHAT = gql`
  mutation StartContextualChat($entryId: String!) {
    startContextualChat(entryId: $entryId) {
      id
      title
      messages {
        id
        role
        content
        createdAt
      }
    }
  }
`;

interface Message {
  id: string;
  role: "USER" | "AI" | "SYSTEM";
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const contextEntryId = searchParams.get("contextEntryId");
  const chatIdParam = searchParams.get("chatId");
  
  const { currentMood } = useMood();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(chatIdParam);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch entry context if present
  const { data: entryData } = useQuery(GET_ENTRY, {
    variables: { id: contextEntryId },
    skip: !contextEntryId,
  });

  // Fetch existing chat if chatId provided
  const { data: chatData } = useQuery(GET_CHAT, {
    variables: { chatId: chatIdParam },
    skip: !chatIdParam,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [startContextualChat] = useMutation(START_CONTEXTUAL_CHAT);
  const hasInitialized = useRef(false);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      // Debug logging
      console.log("Chat initialization:", {
        contextEntryId,
        chatIdParam,
        chatId,
        hasInitialized: hasInitialized.current,
      });

      // Prevent re-initialization
      if (hasInitialized.current) return;
      
      if (chatIdParam && chatData?.chat) {
        // Use existing chat
        hasInitialized.current = true;
        setMessages(chatData.chat.messages);
        setChatId(chatIdParam);
        setIsInitializing(false);
      } else if (contextEntryId) {
        // Start new contextual chat
        hasInitialized.current = true;
        try {
          console.log("Starting contextual chat for entry:", contextEntryId);
          const { data } = await startContextualChat({
            variables: { entryId: contextEntryId },
          });
          console.log("Contextual chat response:", data);
          if (data?.startContextualChat) {
            setChatId(data.startContextualChat.id);
            setMessages(data.startContextualChat.messages);
          }
        } catch (error) {
          console.error("Error starting contextual chat:", error);
          // Fallback: show welcome message
          setMessages([
            {
              id: "welcome",
              role: "AI",
              content: `I see you were writing about "${entryData?.entry?.title || 'something important'}". I'm here to listen and help you work through your thoughts. What's on your mind?`,
              createdAt: new Date().toISOString(),
            },
          ]);
        }
        setIsInitializing(false);
      } else if (!contextEntryId && !chatIdParam) {
        // No context - show default welcome
        hasInitialized.current = true;
        setMessages([
          {
            id: "welcome",
            role: "AI",
            content: "Hello! I'm your AI wellness companion. I'm here to listen and support you. What would you like to talk about today?",
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, [contextEntryId, chatIdParam, chatData, entryData, startContextualChat, chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content: inputMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    try {
      const { data } = await sendMessage({
        variables: {
          input: {
            chatId,
            content: inputMessage,
          },
        },
      });

      if (data?.sendMessage) {
        setChatId(data.sendMessage.id);
        setMessages(data.sendMessage.messages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "AI",
          content: "I'm sorry, I encountered an error. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/journal"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-xl font-bold transition-colors duration-500 ${currentMood.accent}`}>
              AI Wellness Coach
            </h1>
            {contextEntryId && entryData?.entry && (
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Discussing: {entryData.entry.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {isInitializing ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "USER"
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {message.role === "AI" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-400 font-medium">AI Coach</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        {isSending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share what's on your mind..."
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSending}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
