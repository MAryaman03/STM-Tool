import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import waveIcon from "../assets/waveAgent.png";
import "./chatBot.css";

const socket = io("http://localhost:3002");

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  useEffect(() => {
    socket.on("aiMessage", (msg) => {
      setIsTyping(true);
      // Simulate real AI thinking time
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "ai", text: msg }]);
        setIsTyping(false);
      }, Math.random() * 1000 + 500); // 0.5s to 1.5s delay
    });

    return () => {
      socket.off("aiMessage");
    };
  }, []);

  const sendMessage = async () => {
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
        await fetch("http://localhost:3002/newOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.toUpperCase(),
            qty: Number(qty),
            price: Number(price),
            mode: "BUY",
          }),
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
        await fetch("http://localhost:3002/newOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.toUpperCase(),
            qty: Number(qty),
            price: Number(price),
            mode: "SELL",
          }),
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
    // NORMAL CHAT 
    // ==============================
    // If not a buy/sell command, let the backend socket handle it
    socket.emit("userMessage", text);
  };

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
            <button className="back-btn" onClick={() => setIsOpen(false)}>
              ←
            </button>
            <span className="chat-title">Wave Agent</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="msg ai typing-indicator">
                <span>Wave is typing...</span>
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
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;