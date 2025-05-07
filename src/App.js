import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [gameResults, setGameResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });
      
      if (response.data.success) {
        setIsLoggedIn(true);
        setError('');
      } else {
        setError('Нэвтрэх нэр эсвэл нууц үг буруу');
      }
    } catch (err) {
      setError('Нэвтрэхэд алдаа гарлаа');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGameResults([]);
    setSearchQuery('');
  };

  const searchGameVideos = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/games/search?q=${searchQuery}`);
      setGameResults(response.data);
    } catch (err) {
      console.error('Хайлт амжилтгүй', err);
      setGameResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>Нэвтрэх</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Нэвтрэх нэр:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Нууц үг:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn">Нэвтрэх</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Контент</h1>
          <div className="user-section">
            <span className="username">{username}</span>
            <button onClick={handleLogout} className="logout-btn">Гарах</button>
          </div>
        </div>
        
        <div className="search-bar-container">
          <form onSubmit={searchGameVideos} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Тоглоомын нэрээр хайх..."
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Хайж байна...
                </>
              ) : 'Хайх'}
            </button>
          </form>
        </div>
      </header>

      <main className="main-content">
        {selectedGame ? (
          <div className="video-detail-container">
            <button 
              onClick={() => setSelectedGame(null)} 
              className="back-btn"
            >
              ← Буцах
            </button>
            
            <div className="video-player-container">
              <h2 className="video-title">{selectedGame.title}</h2>
              <div className="video-wrapper">
                <video controls autoPlay className="video-player">
                  <source src={selectedGame.videoUrl} type="video/mp4" />
                </video>
              </div>
              
              <div className="video-info">
                <div className="video-stats">
                  <span>Үзсэн: {selectedGame.views}</span>
                  <span>Үргэлжлэх хугацаа: {selectedGame.duration}</span>
                </div>
                <p className="video-description">{selectedGame.description}</p>
                <div className="tags-container">
                  {selectedGame.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="results-container">
            <h2 className="results-title">
              {gameResults.length > 0 
                ? `"${searchQuery}"-ийн хайлтын үр дүн (${gameResults.length})` 
                : 'Тоглоомын бичлэгүүд'}
            </h2>
            
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : gameResults.length > 0 ? (
              <div className="video-grid">
                {gameResults.map((game) => (
                  <div 
                    key={game.id} 
                    className="video-card"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="thumbnail-container">
                      <video className="video-thumbnail">
                        <source src={game.videoUrl} type="video/mp4" />
                      </video>
                      <span className="duration-badge">{game.duration}</span>
                    </div>
                    <div className="video-card-body">
                      <h3 className="card-title">{game.title}</h3>
                      <p className="card-channel">{game.channel}</p>
                      <div className="card-stats">
                        <span>{game.views} үзсэн</span>
                        <span>•</span>
                        <span>{game.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <img src="/no-results.png" alt="No results" className="empty-image" />
                <h3>Хайлтын үр дүн олдсонгүй</h3>
                <p>Өөр тоглоомын нэрээр хайлт хийж үзнэ үү</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 