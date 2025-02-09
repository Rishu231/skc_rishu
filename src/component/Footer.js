import React from "react";

function Footer({
  listening,
  startListening,
  stopListening,
  userInput,
  setUserInput,
  handleTextSubmit,
}) {
  return (
    <div className="footer">
      <div className="voice-controls">
        <button
          onClick={startListening}
          disabled={listening}
        >
          🎤
        </button>
        <button
          onClick={stopListening}
          disabled={!listening}
        >
          ❌
        </button>
      </div>

      <div className="input-controls">
        <input
          type="text"
          placeholder="Ask a question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
        />
        <button onClick={handleTextSubmit}>Send</button>
      </div>
    </div>
  );
}

export default Footer;
