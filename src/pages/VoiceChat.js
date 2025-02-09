import React, { useState, useEffect, useRef } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import Body from "../component/Body";
import ApiCall from "../component/ApiCall";
import "../App.css";

function VoiceChat() {
    const [listening, setListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [userInput, setUserInput] = useState(""); // User input state
    const recognitionRef = useRef(null);
  
    useEffect(() => {
      if ("webkitSpeechRecognition" in window) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";
  
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          sendMessage(transcript);
        };
  
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setError("Speech recognition error. Please try again.");
        };
      } else {
        setError("Speech recognition not supported in this browser.");
      }
    }, []);
  
    const startListening = () => {
      if (recognitionRef.current) {
        setListening(true);
        setError("");
        recognitionRef.current.start();
      }
    };
  
    const stopListening = () => {
      if (recognitionRef.current) {
        setListening(false);
        recognitionRef.current.stop();
      }
    };
  
    const handleTextSubmit = () => {
      if (userInput.trim()) {
        sendMessage(userInput);
        setUserInput(""); // Clear input after submission
      }
    };
  
    const sendMessage = async (text) => {
      setMessages((prevMessages) => [...prevMessages, { text, isBot: false }]);
      setError("");
  
      try {
        const botMessage = await ApiCall(text);
        setMessages((prevMessages) => [...prevMessages, { text: botMessage, isBot: true }]);
      } catch (error) {
        console.error("Error:", error);
        setError(`Something went wrong: ${error.message}`);
      }
    };
  
    return (
        <div className="container-screen">
        <Header />
        <Body messages={messages} error={error} listening={listening} />
        <Footer
          listening={listening}
          startListening={startListening}
          stopListening={stopListening}
          userInput={userInput}
          setUserInput={setUserInput}
          handleTextSubmit={handleTextSubmit}
        />
      </div>
    );
  }
  
  export default VoiceChat;