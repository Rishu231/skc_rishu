import React from "react";
import '../App.css'

function Body({ messages, error, listening }) {
  return (
    <div className="messages">
      {error && <div className="error-message">{error}</div>}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.isBot ? "bot" : "user"}`}
        >
          {msg.text}
        </div>
      ))}
      {listening && (
        <div className="listening-animation">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
}

export default Body;
