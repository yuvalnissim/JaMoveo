import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./PlayerMain.css"; 

const socket = io("https://jamoveo-production-d468.up.railway.app");

const PlayerMain = () => {
    const [currentSong, setCurrentSong] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [currentLine, setCurrentLine] = useState(0);
    const instrument = localStorage.getItem("instrument");

    useEffect(() => {
        socket.on("songSelected", (song) => {
            console.log("🎵 Song received:", song);
            setLoading(true);
            setTimeout(() => {
                setCurrentSong(song);
                setLoading(false);
                setCurrentLine(0); // תחילת השיר מהשורה הראשונה
            }, 2000);
        });

        socket.on("sessionEnded", () => {
            console.log("🚫 Session ended!");
            setCurrentSong(null);
            setIsScrolling(false);
        });

        return () => {
            socket.off("songSelected");
            socket.off("sessionEnded");
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isScrolling && currentSong) {
            interval = setInterval(() => {
                setCurrentLine((prev) => {
                    if (prev < currentSong.lyricsAndChords.length - 1) {
                        return prev + 1; // מעבר לשורה הבאה
                    } else {
                        setIsScrolling(false); // עצירת הגלילה בסוף השיר
                        return prev;
                    }
                });
            }, 2500); // **זמן מעבר בין שורות (3 שניות)**
        }
        return () => clearInterval(interval);
    }, [isScrolling, currentSong]);

    return (
        <div className="player-container">
            <h2>🎸 Player Screen</h2>
            
            {loading ? (
                <div className="loader"></div> // ✅ אנימציית טעינה
            ) : currentSong ? (
                <div className="live-song">
                    <h3 className="song-title">{currentSong.title} - {currentSong.artist}</h3>

                    <div className="song-scroll">
                        {currentSong.lyricsAndChords.slice(currentLine, currentLine + 2).map((line, index) => (
                            <div key={index} className="song-line">
                                {instrument !== "vocals" && <p className="chords">{line.chords}</p>}
                                <p className="lyrics">{line.lyrics}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h3 className="waiting-text">⌛ Waiting for next song...</h3>
            )}

            {currentSong && (
                <button
                    className="scroll-button"
                    onClick={() => {
                        setIsScrolling(!isScrolling);
                        console.log("🔽 Scroll state changed:", !isScrolling);
                    }}
                >
                    {isScrolling ? "🛑 Stop Scroll" : "🔽 Start Scroll"}
                </button>
            )}
        </div>
    );
};

export default PlayerMain;
