import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = 'https://app.ftoyd.com/fronttemp-service';

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/fronttemp`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('API unavailable');
      }

      const result = await response.json();
      if (!result.ok || !result.data?.matches) {
        throw new Error('Invalid response format');
      }

      setMatches(result.data.matches);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Ошибка: не удалось загрузить информацию');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">MatchTracker</h1>
       
   <div className="header-right">
  
  {error && <div className="error">
    <img src="/alert-triangle.png" alt="Error" className="error-icon" />
    { error}
    </div>}
  <button
    className="refresh-btn"
    onClick={fetchMatches}
    disabled={isLoading}
  >
    {isLoading ? 'Загрузка...' : 'Обновить'}
  </button>
</div>
      </header>

      {isLoading && !error && (
        <div className="loading">Загрузка...</div>
      )}

      {!isLoading && !error && matches.length > 0 && (
        <div className="match-list">
          {matches.map((match, index) => (
            <div key={index} className="match-card">
              <div className='frame'>
              <div className="team-container">
              <img
            src={`/illustrations_role.png`} 
            alt="Illustration"
            className="team-logo"
          />
         
                <span className="team">{match.homeTeam.name}</span>
              </div>
              <div className="score"> 
                 <span className="status-score">
                {match.homeScore}:{match.awayScore}
              </span>
              <span className={`status ${match.status === 'Finished' ? 'finished' : ''}`}>{match.status}</span>
              </div>
            
              <div className="team-container">
              <img
            src={`/illustrations_role.png`} 
            alt="Illustration"
            className="team-logo"
          />
          <span 
                className="team">{match.awayTeam.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && matches.length === 0 && (
        <div className="no-data">Матчи не найдены</div>
      )}
    </div>
  );
}

export default App;