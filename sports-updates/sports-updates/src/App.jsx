import { useEffect, useState } from "react";
import axios from "axios";

export default function SportsUpdates() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [filter]);

  const fetchGames = async () => {
    try {
      const sport = filter === "all" ? "" : `&s=${filter}`;
      const res = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=2024-06-01${sport}`);
      const eventList = res.data?.events || [];
      setGames(eventList);
    } catch (err) {
      console.error("API Error", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🏈 Live Game Updates</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Filter by Sport:</label>
        <select
          className="p-2 border rounded w-full max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Sports</option>
          <option value="Soccer">Soccer</option>
          <option value="Basketball">Basketball</option>
          <option value="Baseball">Baseball</option>
          <option value="American Football">Football</option>
        </select>
      </div>

      <div className="grid gap-4">
        {games.length === 0 ? (
          <div>No games found for selected filter or time.</div>
        ) : (
          games.map((game, idx) => (
            <div key={idx} className="border p-4 rounded shadow bg-white">
              <div className="text-xl font-semibold">
                {game.strEvent || `${game.strHomeTeam} vs ${game.strAwayTeam}`}
              </div>
              <div className="text-lg">
                {game.intHomeScore} - {game.intAwayScore}
              </div>
              <div className="text-sm text-gray-500">{game.strTime} | {game.strLeague}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
