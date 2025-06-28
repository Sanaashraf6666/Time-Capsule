import React, { useState, useEffect } from 'react';
import './App.css';

interface Capsule {
  message: string;
  unlockDate: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    loadCapsules();
  }, []);

  const loadCapsules = () => {
    try {
      const data = localStorage.getItem('capsules');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setCapsules(parsed);
        } else {
          setCapsules([]);
        }
      } else {
        setCapsules([]);
      }
    } catch (error) {
      console.error('Error loading capsules:', error);
      setCapsules([]);
    }
  };

  const saveCapsules = (capsules: Capsule[]) => {
    try {
      localStorage.setItem('capsules', JSON.stringify(capsules));
    } catch (error) {
      console.error('Error saving capsules:', error);
    }
  };

  const addCapsule = () => {
    if (!message.trim() || !date.trim()) {
      alert('Please fill in both fields.');
      return;
    }

    const newCapsule: Capsule = {
      message,
      unlockDate: date,
      createdAt: new Date().toISOString(),
    };

    const updated = [...capsules, newCapsule];
    setCapsules(updated);
    saveCapsules(updated);
    setMessage('');
    setDate('');
  };

  const deleteCapsule = (index: number) => {
    const updated = capsules.filter((_, i) => i !== index);
    setCapsules(updated);
    saveCapsules(updated);
  };

  return (
    <div className="app-container">
      <h1>Time Capsule</h1>
      <div className="form">
        <textarea
          placeholder="Write a message to your future self"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={() => addCapsule()}>Add Capsule</button>
      </div>

      <h2>Your Capsule List:</h2>

      {capsules.length === 0 ? (
        <p>No capsules yet. Add one above!</p>
      ) : (
        <div className="capsule-list">
          {capsules.map((capsule, index) => {
            const isUnlocked =
              capsule.unlockDate &&
              new Date() >= new Date(capsule.unlockDate);

            return (
              <div
                key={index}
                className={`capsule ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <p>{isUnlocked ? capsule.message : '🔒 Locked'}</p>
                <p>
                  Unlock: {new Date(capsule.unlockDate).toLocaleDateString()}
                </p>
                <p>
                  Created: {new Date(capsule.createdAt).toLocaleDateString()}
                </p>
                {isUnlocked && (
                  <button onClick={() => deleteCapsule(index)}>Delete</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
