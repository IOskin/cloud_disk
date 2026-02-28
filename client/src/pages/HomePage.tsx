import { useState } from "react"
import { VideoUpload } from "../components/VideoUpload/VideoUpload.tsx"
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer.tsx"
import { VideoGrid } from "../components/VideoGrid/VideoGrid.tsx"
import './HomePage.css'

export const HomePage = () => {
  const [filename, setFilename] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(false)

  const handleUpload = (uploadedFilename: string) => {
    setFilename(uploadedFilename)
    setRefresh(prev => !prev)
  }

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">Стриминг видео</h1>
        <VideoUpload onUpload={handleUpload} />
        {filename && <VideoPlayer filename={filename} />}
        <VideoGrid onSelect={setFilename} refresh={refresh} />
      </div>
    </>
  );
}
