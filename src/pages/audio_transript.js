import React, { useState, useEffect, useRef } from "react";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const silenceTimer = useRef(null);

  let recognition;

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      clearTimeout(silenceTimer.current); // Reset silence timer
      let finalText = "";
      for (let i = 0; i < event.results.length; i++) {
        finalText = event.results[i][0].transcript + " ";
      }
      setCurrentText(finalText);

      // Start silence detection timer (3 seconds)
      silenceTimer.current = setTimeout(() => {
        if (finalText.trim() !== "") {
          setTranscript((prev) => [...prev, finalText.trim()]);
          setCurrentText("");
        }
      }, 3000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };
  } else {
    alert("Your browser does not support speech recognition.");
  }

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
      clearTimeout(silenceTimer.current);
      if (currentText.trim() !== "") {
        setTranscript((prev) => [...prev, currentText.trim()]);
        setCurrentText("");
      }
    }
  };

  const clearText = () => {
    setTranscript([]);
    setCurrentText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript.join("\n") + (currentText ? "\n" + currentText : ""));
    alert("Text copied to clipboard!");
  };

  const sendToAPI = async () => {
    const textToSend = transcript.join("\n") + (currentText ? "\n" + currentText : "");
    
    try {
      const response = await fetch("https://your-api-endpoint.com/save-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        <p style={{ fontStyle: "italic", color: "gray" }}>{currentText}</p>
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
