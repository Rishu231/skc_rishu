// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';

// function App() {
//   const [userInput, setUserInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const messagesEndRef = useRef(null);

//   // Automatically scrolls to the bottom when a new message is added
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Function to convert text with bullet points into HTML lists
//   const formatMessage = (message) => {
//     const lines = message.split('\n');
//     const formattedLines = [];
//     let currentList = [];

//     lines.forEach((line) => {
//       if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
//         // If line starts with * or -, treat it as a bullet point
//         if (currentList.length === 0) {
//           formattedLines.push(<ul key={formattedLines.length} />);
//         }
//         currentList.push(<li key={currentList.length}>{line.substring(2).trim()}</li>);
//       } else {
//         // If it's regular text, just add as paragraph
//         if (currentList.length > 0) {
//           formattedLines.push(...currentList);
//           currentList = [];
//         }
//         formattedLines.push(<p key={formattedLines.length}>{line}</p>);
//       }
//     });

//     if (currentList.length > 0) {
//       formattedLines.push(...currentList); // In case the last part is a list
//     }

//     return formattedLines;
//   };

//   const sendMessage = async () => {
//     if (!userInput) return;

//     setMessages(prevMessages => [
//       ...prevMessages,
//       { text: userInput, isBot: false },
//     ]);
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/ai/res/?question=${encodeURIComponent(userInput)}`, {
//         method: 'GET',
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       const botMessage = data.result;

//       // Format the bot's response before displaying it
//       const formattedMessage = formatMessage(botMessage);

//       setMessages(prevMessages => [
//         ...prevMessages,
//         { text: formattedMessage, isBot: true },
//       ]);
//       setUserInput('');
//     } catch (error) {
//       console.error('Error:', error);
//       setError(`Something went wrong: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-box">
//         <h2>Python Tutor</h2>
//         <div id="messages" className="messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
//               <span className="message-text">{msg.text}</span>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         {error && <div className="error">{error}</div>}
//         <div className="input-container">
//           <input
//             type="text"
//             id="user_input"
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             placeholder="Ask a Python question..."
//             disabled={loading}
//           />
//           <button onClick={sendMessage} disabled={loading} className="send-button">
//             {loading ? 'Loading...' : 'Send'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import avatar from './images/boy.png';

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaVolumeUp, FaPauseCircle } from 'react-icons/fa'; // FontAwesome icons

function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if something is being spoken
  const [isPaused, setIsPaused] = useState(false); // Track if speech is paused
  const messagesEndRef = useRef(null);
  const utteranceRef = useRef(null); // Ref to store the utterance for controlling pause/resume

  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to convert text with bullet points into HTML lists
  const formatMessage = (message) => {
    const lines = message.split('\n');
    const formattedLines = [];
    let currentList = [];

    lines.forEach((line) => {
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        // If line starts with * or -, treat it as a bullet point
        if (currentList.length === 0) {
          formattedLines.push(<ul key={formattedLines.length} />);
        }
        currentList.push(<li key={currentList.length}>{line.substring(2).trim()}</li>);
      } else {
        // If it's regular text, just add as paragraph
        if (currentList.length > 0) {
          formattedLines.push(...currentList);
          currentList = [];
        }
        formattedLines.push(<p key={formattedLines.length}>{line}</p>);
      }
    });

    if (currentList.length > 0) {
      formattedLines.push(...currentList); // In case the last part is a list
    }

    return formattedLines;
  };

  // Function to start speech synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Save reference to utterance
      const voices = speechSynthesis.getVoices();

      // Optionally set the voice, pitch, and rate
      utterance.voice = voices[1]; // Choose a voice (change index for different voices)
      utterance.pitch = 1; // Normal pitch
      utterance.rate = 1; // Normal speed

      // Start speaking
      speechSynthesis.speak(utterance);

      // Trigger the speaking animation on start
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      // Stop the speaking animation when speaking ends
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      // Listen to pause and resume events
      speechSynthesis.onpause = () => {
        setIsPaused(true);
      };
      speechSynthesis.onresume = () => {
        setIsPaused(false);
      };
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };

  // Function to handle pause and resume
  const handlePauseResume = () => {
    if (isPaused) {
      // Resume speech
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // Pause speech
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Send user message and get bot response
  const sendMessage = async () => {
    if (!userInput) return;

    setMessages(prevMessages => [
      ...prevMessages,
      { text: userInput, isBot: false },
    ]);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://65.0.135.230/ai/?question=${encodeURIComponent(userInput)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = data.result;

      // Format the bot's response before displaying it
      const formattedMessage = formatMessage(botMessage);

      // Add the bot's message to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: formattedMessage, isBot: true },
      ]);

      // Make the bot speak the message
      speakText(botMessage);

      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
      setError(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2>Learning Python</h2>

        {/* Character Avatar with speaking animation */}
        <div className={`avatar ${isSpeaking ? 'speaking' : ''}`}>
          <img src={avatar} alt="Character Avatar" />
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
              <span className="message-text">{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="input-container">
          <input
            type="text"
            id="user_input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a Python question..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? 'Loading...' : 'Send'}
          </button>
        </div>

        {/* Speaker Button */}
        <div className="speaker-button" onClick={handlePauseResume}>
          {isPaused ? <FaVolumeUp size={24} /> : <FaPauseCircle size={24} />}
        </div>
      </div>
    </div>
  );
}

export default App;
