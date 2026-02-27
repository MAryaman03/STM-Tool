import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import waveIcon from "../assets/waveAgent.png";
import "./chatBot.css";

const socket = io("http://localhost:3002");

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("aiMessage", (msg) => {
      setMessages((prev) => [...prev, { type: "ai", text: msg }]);
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

    // ==============================
    // BUY COMMAND: buy RELIANCE 10 2500
    // ==============================
    if (lower.startsWith("buy") && parts.length === 4) {
      const [, name, qty, price] = parts;

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

        setMessages((prev) => [
          ...prev,
          { type: "user", text },
          { type: "ai", text: `✅ Buy order placed for ${name.toUpperCase()}` },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "❌ Failed to place buy order." },
        ]);
      }

      setInput("");
      return;
    }

    // ==============================
    // SELL COMMAND: sell TCS 5 3500
    // ==============================
    if (lower.startsWith("sell") && parts.length === 4) {
      const [, name, qty, price] = parts;

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

        setMessages((prev) => [
          ...prev,
          { type: "user", text },
          { type: "ai", text: `✅ Sell order placed for ${name.toUpperCase()}` },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "❌ Failed to place sell order." },
        ]);
      }

      setInput("");
      return;
    }

    // ==============================
    // NORMAL CHAT (Portfolio / Risk / etc.)
    // ==============================

    socket.emit("userMessage", text);

    setMessages((prev) => [
      ...prev,
      { type: "user", text },
    ]);

    setInput("");
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
            <button
              className="back-btn"
              onClick={() => setIsOpen(false)}
            >
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
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try: buy RELIANCE 10 2500 | sell TCS 5 3500 | portfolio"
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