import { useRef, useState, useCallback, useEffect } from "react";
import "./VideoPlayer.css";
import useFetch from "../../hooks/useFetch";

interface VideoPlayerProps {
  filename: string;
}

export const VideoPlayer = ({ filename }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: videoLink }
    = useFetch<{ url: string }>(`/api/video/${filename}/url`)

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s}` : `${m}:${s}`;
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    } else {
      v.play();
      resetHideTimer();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || seeking) return;
    setProgress((v.currentTime / v.duration) * 100);
    setCurrentTime(formatTime(v.currentTime));
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    setDuration(formatTime(v.duration));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.currentTime = (val / 100) * v.duration;
    setProgress(val);
    setCurrentTime(formatTime(v.currentTime));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const volumeIcon =
    muted || volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : volume < 0.7 ? "🔉" : "🔊";

  return (
    <div
      className="vp-wrap"
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <div className="vp-corner-accent" />
      <div className="vp-corner-accent vp-corner-accent--br" />

      <div className="vp-video-area" onClick={togglePlay}>
        <div className="vp-scanlines" />
        <video
          ref={videoRef}
          src={videoLink?.url ?? undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setPlaying(false);
            setShowControls(true);
          }}
        />
        <div className="vp-play-overlay">
          <div className="vp-play-overlay-btn">{playing ? "⏸" : "▶"}</div>
        </div>
      </div>

      <div className={`vp-controls${!showControls ? " vp-controls--hidden" : ""}`}>
        <div className="vp-progress-row">
          <div className="vp-progress-track">
            <div className="vp-buffered-fill" style={{ width: `${buffered}%` }} />
            <div className="vp-progress-fill" style={{ width: `${progress}%` }} />
            <div className="vp-thumb-dot" style={{ left: `${progress}%` }} />
            <input
              type="range"
              className="vp-progress-input"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              onMouseDown={() => setSeeking(true)}
              onMouseUp={() => setSeeking(false)}
            />
          </div>
        </div>

        <div className="vp-bottom-row">
          <button className="vp-btn vp-btn--play" onClick={togglePlay}>
            {playing ? "⏸" : "▶"}
          </button>

          <div className="vp-time">
            <span className="vp-time-current">{currentTime}</span>
            {" / "}
            {duration}
          </div>

          <div className="vp-spacer" />

          <div className="vp-volume-cluster">
            <button className="vp-btn vp-btn--mute" onClick={toggleMute}>
              {volumeIcon}
            </button>
            <div className="vp-volume-track">
              <div
                className="vp-volume-fill"
                style={{ width: `${muted ? 0 : volume * 100}%` }}
              />
              <input
                type="range"
                className="vp-volume-input"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={handleVolume}
              />
            </div>
          </div>

          <button className="vp-btn vp-btn--fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? "⊡" : "⛶"}
          </button>
        </div>
      </div>
    </div>
  );
};
