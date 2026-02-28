import { useEffect, useState } from "react"
import { getVideoList, getVideoUrl } from "../../api/video"
import './VideoGrid.css'

interface VideoGridProps {
  onSelect: (filename: string) => void,
  refresh: boolean
}

export const VideoGrid = ({ onSelect, refresh }: VideoGridProps) => {


  const [videos, setVideos] = useState<string[]>([])

  useEffect(() => {
    console.log(1)
    const controller = new AbortController()

    getVideoList(controller.signal)
      .then(setVideos)
      .catch(console.error)

    return () => controller.abort()
  }, [refresh])


  return (
    <div className="video-grid">
      {videos.map((filename) => (
        <div key={filename} className="video-item">
          <div className="card">
            <button className="card-action" onClick={() => onSelect(filename)}>
              <video preload="none" src={getVideoUrl(filename)} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
