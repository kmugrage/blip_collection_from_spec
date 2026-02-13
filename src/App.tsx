import { useState } from 'react';
import BlipForm from './components/BlipForm';
import SuccessMessage from './components/SuccessMessage';
import './App.css';

function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">Technology Radar</h1>
          <h2 className="app-subtitle">Blip Submission</h2>
        </div>
      </header>

      <main className="container">
        {submitted ? (
          <SuccessMessage onSubmitAnother={handleSubmitAnother} />
        ) : (
          <BlipForm onSuccess={handleSuccess} />
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2026 Thoughtworks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
