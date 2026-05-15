import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import api, { API_URL } from "../utils/api";
import waveIcon from "../assets/waveAgent.png";
import "./chatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const parent = messagesEndRef.current.parentNode;
      parent.scrollTop = parent.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Connect socket only once on mount, disconnect on unmount
  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("aiMessage", (msg) => {
      setIsTyping(true);
      // Simulate real AI thinking time
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "ai", text: msg }]);
        setIsTyping(false);
      }, Math.random() * 1000 + 500);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Initial greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { type: "ai", text: "Hi! I am Wave, your trading assistant. You can ask me about your portfolio, or place orders (e.g. 'buy RELIANCE 10 2500')." }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const text = input.trim();
    const lower = text.toLowerCase();
    const parts = text.split(" ");

    // Instantly show user message
    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setIsTyping(true);

    // ==============================
    // BUY COMMAND: buy RELIANCE 10 2500
    // ==============================
    if (lower.startsWith("buy") && parts.length >= 4) {
      const name = parts[1];
      const qty = parts[2];
      const price = parts[3];

      try {
        await api.post("/newOrder", {
          name: name.toUpperCase(),
          qty: Number(qty),
          price: Number(price),
          mode: "BUY",
        });

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: "ai", text: `✅ Nice! Buy order placed successfully for ${name.toUpperCase()} (Qty: ${qty} @ ₹${price}).` },
          ]);
          setIsTyping(false);
        }, 1200);

      } catch {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: "ai", text: "❌ Oops, I failed to place your buy order. Please check your connection or funds." },
          ]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // ==============================
    // SELL COMMAND: sell TCS 5 3500
    // ==============================
    if (lower.startsWith("sell") && parts.length >= 4) {
      const name = parts[1];
      const qty = parts[2];
      const price = parts[3];

      try {
        await api.post("/newOrder", {
          name: name.toUpperCase(),
          qty: Number(qty),
          price: Number(price),
          mode: "SELL",
        });

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: "ai", text: `✅ Sell order placed for ${name.toUpperCase()} (Qty: ${qty} @ ₹${price}).` },
          ]);
          setIsTyping(false);
        }, 1200);

      } catch {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: "ai", text: "❌ Sorry, I failed to place the sell order. Please try again." },
          ]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // ==============================
    // NORMAL CHAT (AI ASSISTANT)
    // ==============================
    try {
      const response = await api.post("/chat", { message: text });
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "ai", text: response.data.reply }]);
        setIsTyping(false);
      }, Math.random() * 1000 + 500); // 0.5s to 1.5s delay
    } catch {
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "ai", text: "❌ Sorry, I'm having trouble connecting to my brain right now." }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [input]);

  return (
    <>
      {!isOpen && (
        <img
          src={waveIcon}
          alt="Wave Agent"
          className="chat-icon-img"
          onClick={() => setIsOpen(true)}
        />
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-window-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={waveIcon} alt="Agent" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <span className="chat-title">Wave Agent</span>
            </div>
            <button className="back-btn" onClick={() => setIsOpen(false)} title="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.type}`}>
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="msg ai typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. buy RELIANCE 10 2500 or ask 'portfolio'"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} title="Send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;