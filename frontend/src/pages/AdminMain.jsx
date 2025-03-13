import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://jamoveo-production-d468.up.railway.app");

const AdminMain = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    const songDatabase = [
        { title: "Wonderwall", artist: "Oasis", lyricsAndChords: [
            { chords: "Em       G       D       A", lyrics: "Today is gonna be the day" },
            { chords: "Em       G       D       A", lyrics: "That they're gonna throw it back to you" },
            { chords: "C       Em       D", lyrics: "By now you should've somehow" },
            { chords: "C       Em       D", lyrics: "Realized what you gotta do" }
        ]},
        { title: "Imagine", artist: "John Lennon", lyricsAndChords: [
            { chords: "C       F       G", lyrics: "Imagine there's no heaven" },
            { chords: "C       F       G", lyrics: "It's easy if you try" },
            { chords: "C       F       G", lyrics: "No hell below us" },
            { chords: "C       F       G", lyrics: "Above us only sky" }
        ]},
        { title: "Hotel California", artist: "Eagles", lyricsAndChords: [
            { chords: "Bm       F#       A       E", lyrics: "On a dark desert highway, cool wind in my hair" },
            { chords: "G       D       Em       F#", lyrics: "Warm smell of colitas, rising up through the air" }
        ]},
        { title: "Hey Jude", artist: "The Beatles", lyricsAndChords: [
            { chords: "C       G       Am       F", lyrics: "Hey Jude, don't make it bad" },
            { chords: "C       G       F       C", lyrics: "Take a sad song and make it better" }
        ]},
        { title: "Shape of You", artist: "Ed Sheeran", lyricsAndChords: [
            { chords: "C#m       F#m       A       B", lyrics: "The club isn't the best place to find a lover" },
            { chords: "C#m       F#m       A       B", lyrics: "So the bar is where I go" }
        ]},
        { title: "Bohemian Rhapsody", artist: "Queen", lyricsAndChords: [
            { chords: "Gm       Bb       Eb", lyrics: "Is this the real life? Is this just fantasy?" },
            { chords: "Cm       Bb       F", lyrics: "Caught in a landslide, no escape from reality" }
        ]},
        { title: "Let It Be", artist: "The Beatles", lyricsAndChords: [
            { chords: "C       G       Am       F", lyrics: "When I find myself in times of trouble" },
            { chords: "C       G       F       C", lyrics: "Mother Mary comes to me" }
        ]},
        { title: "Smells Like Teen Spirit", artist: "Nirvana", lyricsAndChords: [
            { chords: "F       Bb       Ab       Db", lyrics: "Load up on guns, bring your friends" },
            { chords: "F       Bb       Ab       Db", lyrics: "It's fun to lose and to pretend" }
        ]},
        { title: "Hallelujah", artist: "Leonard Cohen", lyricsAndChords: [
            { chords: "C       Am       F       G", lyrics: "Now I've heard there was a secret chord" },
            { chords: "C       Am       F       G", lyrics: "That David played, and it pleased the Lord" }
        ]},
        { title: "Yesterday", artist: "The Beatles", lyricsAndChords: [
            { chords: "F#m       E       A       D", lyrics: "Yesterday, all my troubles seemed so far away" },
            { chords: "F#m       E       A       D", lyrics: "Now it looks as though they're here to stay" }
        ]}
    ];

    const handleSearch = () => {
        const filtered = songDatabase.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    };

    const selectSong = (song) => {
        setSelectedSong(song);
        socket.emit("songSelected", song);
    };

    const endSession = () => {
        socket.emit("sessionEnded");
        setSelectedSong(null);
    };

    return (
        <div className="admin-container">
            <h2>🎵 Admin Panel</h2>
            {!selectedSong ? (
                <>
                    <input type="text" placeholder="Search for a song..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button onClick={handleSearch}>🔍 Search</button>
                    <ul>
                        {results.map((song, index) => (
                            <li key={index} onClick={() => selectSong(song)}>
                                🎶 {song.title} - {song.artist}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <div className="live-song">
                    <h3>🎼 Now Playing: {selectedSong.title} - {selectedSong.artist}</h3>
                    <div className="lyrics-chords">
                        {selectedSong.lyricsAndChords.map((line, index) => (
                            <div key={index} className="song-line">
                                <p className="chords">{line.chords}</p>
                                <p className="lyrics">{line.lyrics}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={endSession}>🚫 Quit Session</button>
                </div>
            )}
        </div>
    );
};

export default AdminMain;
