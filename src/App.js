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


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/VoiceChat.js'; 
import Atscript from './pages/audio_transript.js'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/tscript" element={<Atscript />} />
      </Routes>
    </Router>
  );
}

export default App;

