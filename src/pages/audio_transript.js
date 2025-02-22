import React, { useState, useRef } from "react";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);

  if (!recognitionRef.current && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keeps listening until manually stopped
    recognition.interimResults = false; // Only final results
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      clearTimeout(silenceTimer.current);
      const newText = event.results[event.results.length - 1][0].transcript.trim();
      
      setTranscript((prev) => [...prev, newText]);

      // Move to next line after 3 seconds of silence
      silenceTimer.current = setTimeout(() => {
        setTranscript((prev) => [...prev, ""]); // Adds a blank line to separate sentences
      }, 3000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionRef.current = recognition;
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
      clearTimeout(silenceTimer.current);
    }
  };

  const clearText = () => {
    setTranscript([]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript.join("\n"));
    alert("Text copied to clipboard!");
  };

  const sendToAPI = async () => {
    const textToSend = transcript.join("\n");

    try {
      const response = await fetch("https://your-api-endpoint.com/save-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });

      if (response.ok) {
        alert("Text successfully sent to API!");
      } else {
        alert("Failed to send text.");
      }
    } catch (error) {
      console.error("Error sending text:", error);
      alert("Error sending text.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Speech to Text with Auto Line Break</h2>

      <div>
        <button onClick={startListening} disabled={isListening} style={buttonStyle}>
          🎤 Start Listening
        </button>
        <button onClick={stopListening} disabled={!isListening} style={buttonStyle}>
          🛑 Stop Listening
        </button>
        <button onClick={clearText} style={buttonStyle}>
          🧹 Clear Text
        </button>
        <button onClick={copyToClipboard} style={buttonStyle}>
          📋 Copy Text
        </button>
        <button onClick={sendToAPI} style={buttonStyle}>
          📤 Send to API
        </button>
      </div>

      <div style={textBoxStyle}>
        <h3>Transcribed Text:</h3>
        {transcript.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#007BFF",
  color: "white",
};

const textBoxStyle = {
  marginTop: "20px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "60%",
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "left",
  backgroundColor: "#f9f9f9",
};

export default SpeechToText;
