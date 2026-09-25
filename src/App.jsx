import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [guestName, setGuestName] = useState('');
  
  const [currentTheme, setCurrentTheme] = useState('green'); 
  const [inputMode, setInputMode] = useState('audio'); 
  const [textMessage, setTextMessage] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setUploadStatus('');
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) { 
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Error:", error);
      alert("Tolong izinkan akses mikrofon di browser Anda.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordClick = () => {
    if (guestName.trim() === '') return;
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleUpload = async () => {
    if (inputMode === 'audio' && !audioBlob) return;
    if (inputMode === 'text' && textMessage.trim() === '') return;
    
    setIsUploading(true);
    setUploadStatus('⏳ Mengirim pesan...');

    const safeName = guestName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
    const timestamp = new Date().getTime(); 

    const formData = new FormData();
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", `${safeName}_${timestamp}`);

    if (inputMode === 'audio') {
      formData.append("file", audioBlob, `${safeName}_${timestamp}.webm`);
      formData.append("resource_type", "video");
    } else {
      const textBlob = new Blob([textMessage], { type: 'text/plain' });
      formData.append("file", textBlob, `${safeName}_${timestamp}.txt`);
      formData.append("resource_type", "raw"); 
    }

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setUploadStatus('✅ Pesan berhasil terkirim! Terima kasih.');
        setAudioBlob(null);
        setTextMessage('');
        setGuestName(''); 
        setInputMode('audio'); 
      } else {
        setUploadStatus('❌ Gagal mengirim pesan.');
      }
    } catch (error) {
      setUploadStatus('❌ Terjadi kesalahan jaringan.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={`app-wrapper theme-${currentTheme}`}>
      <header className="top-nav">
        <div className="logo-placeholder">♡ Vowelle</div>
      </header>

      <main className="main-content">
        <div className="title-section">
          <div className="ribbon-icon">🎀</div>
          <h1>Leave a Message <br/> for the <span className="script-text">Newlyweds</span></h1>
          <p className="subtitle">
            Your words, your voice, your wishes — <br/> 
            a special message that they'll keep forever.
          </p>
        </div>

        {!audioBlob && uploadStatus === '' && inputMode === 'audio' && (
          <div className="input-section">
            <input 
              type="text" 
              className="name-input"
              placeholder="Enter your name to begin..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isRecording}
            />
          </div>
        )}


        {inputMode === 'audio' && !audioBlob && uploadStatus === '' && (
          <>
            <div className="record-section">
              <button 
                className={`mic-button ${isRecording ? 'recording' : ''} ${guestName.trim() === '' ? 'disabled' : ''}`}
                onClick={handleRecordClick}
                disabled={guestName.trim() === ''}
              ></button>
              
              <p className="record-instruction">
                {isRecording ? <span style={{color: '#d4af37', fontWeight: 'bold'}}>{formatTime(recordingTime)}</span> : 'Hold to record'}
                <br/>
                <span className="small-text">(up to 60 seconds)</span>
              </p>
            </div>

            <button className="image-btn" onClick={() => setInputMode('text')}>
              <img src="/gold.png" alt="✍️ Or write a message ➔" />
            </button>
          </>
        )}

        {inputMode === 'audio' && audioBlob && !isUploading && uploadStatus === '' && (
          <div className="preview-section">
            <p className="guest-name-display">Message from: <strong>{guestName}</strong></p>
            <audio src={URL.createObjectURL(audioBlob)} controls className="audio-player" />
            <div className="action-buttons">
              <button className="retake-btn" onClick={() => setAudioBlob(null)}>Retake</button>
              <button className="send-btn" onClick={handleUpload}>Send Message</button>
            </div>
          </div>
        )}

        {inputMode === 'text' && uploadStatus === '' && (
          <div className="text-mode-section">
            <input 
              type="text" 
              className="name-input"
              placeholder="Your Name..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <textarea
              className="text-message-input"
              placeholder="Type your beautiful message here..."
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              rows={6}
              maxLength={300} 
            />
            <p className="char-counter">{textMessage.length}/300</p>

            <div className="action-buttons">
              <button className="retake-btn" onClick={() => setInputMode('audio')}>⬅ Back</button>
              <button className="send-btn" onClick={handleUpload} disabled={textMessage.trim() === '' || guestName.trim() === ''}>
                Send Message
              </button>
            </div>
          </div>
        )}

        {(isUploading || uploadStatus !== '') && (
          <div className="upload-status">
            <p className="status-message">{uploadStatus}</p>
            {uploadStatus.includes('berhasil') && (
              <button className="mode-switch-btn mt-3" onClick={() => setUploadStatus('')}>
                Send Another Message
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        Thank you for being part of our special day ♡
      </footer>
    </div>
  );
}

export default App;