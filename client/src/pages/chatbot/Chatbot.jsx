import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", profileLink: "" });

  const questions = [
    "Hello! What's your name?",
    "Great! Can you share your email?",
    "Thanks! What's your phone number?",
    "Awesome! Please provide a link to your profile (LinkedIn, Facebook, etc.)"
  ];

  const handleMessage = async (input) => {
    if (!input) return;

    const newMessages = [...messages, { sender: "user", text: input }];

    if (step < questions.length) {
      setFormData({ ...formData, [Object.keys(formData)[step]]: input });
      newMessages.push({ sender: "bot", text: questions[step] });
      setStep(step + 1);
    } else {
      newMessages.push({ sender: "bot", text: "Processing your lead score..." });

      // Send data to backend
      const response = await axios.post("http://localhost:5000/analyze-profile", formData);
      newMessages.push({ sender: "bot", text: `Your Lead Score is: ${response.data.leadScore}` });
    }

    setMessages(newMessages);
  };

  return (
    <div style={{ width: "400px", border: "1px solid black", padding: "10px" }}>
      <h3>Chat with AI</h3>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid gray", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender === "user" ? "You: " : "Bot: "}</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type here..."
        onKeyDown={(e) => e.key === "Enter" && handleMessage(e.target.value)}
      />
    </div>
  );
};

export default Chatbot;
