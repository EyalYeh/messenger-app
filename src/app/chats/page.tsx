"use client";
import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { Box, TextField, Button, Typography } from "@mui/material";

type Message = {
  sender: "user" | "bot";
  content: string;
};

export default function ChatsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
  if (!input.trim()) return;

  const newMessages: Message[] = [
    ...messages,
    { sender: "user", content: input },
    { sender: "bot", content: "The chat is sadly not fully active yet." }
  ];
  setMessages(newMessages);
  setInput("");
};

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="p-4 max-w-md mx-auto">
        <div className="border rounded p-4 h-96 overflow-y-auto bg-white shadow">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 text-sm ${msg.sender === "user" ? "text-blue-600 text-right" : "text-gray-700"}`}>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <TextField
            fullWidth
            label="Type your message"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="contained"
            color="primary"
            onClick={handleSend}
            sx={{ minWidth: "100px" }}>Send</Button>
        </div>
      </div>
    </div>
  );
}