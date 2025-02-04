
// Step 2: Frontend (React.js)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [mirrorText, setMirrorText] = useState('');
  const [correctText, setCorrectText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    fetchMirrorText();
  }, []);

  const fetchMirrorText = async () => {
    const response = await axios.get('https://backend-mirror-image-text-reading-usyc.onrender.com/api/mirror-text');
    setMirrorText(response.data.text);
    setCorrectText(response.data.correctText);
    setUserInput('');
    setAttempts(0);
    setTimeTaken(0);
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const handleSubmit = async () => {
    if (timer) clearInterval(timer);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const takenTime = timeTaken;
    
    try {
      const response = await axios.post('https://backend-mirror-image-text-reading-usyc.onrender.com/api/submit', {
        userInput,
        correctText,
        timeTaken: takenTime,
        attempts: newAttempts,
      });

      if (response.data.isCorrect) {
        toast.success(`Correct! Time taken: ${takenTime}s, Attempts: ${newAttempts}`);
        setTimeout(() => {
          fetchMirrorText();
        }, 1000);
      } else {
        toast.error('Incorrect! Try again.');
      }
    } catch (error) {
      console.error('Error submitting attempt:', error);
    }
  };

  return (
    <div className="app">
      <h1>Mirror-Image Text Challenge</h1>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="mirror-text">{mirrorText}</div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type the correct text"
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={fetchMirrorText}>Next Challenge</button>
      <p>Time Taken: {timeTaken} seconds</p>
      <p>Attempts: {attempts}</p>
    </div>
  );
};

export default App;