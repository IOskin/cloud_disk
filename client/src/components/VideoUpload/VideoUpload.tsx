import { useState } from "react"
import { uploadVideo } from "../../api/video.ts"
import './VideoUpload.css'

interface VideoUploadProps {
  onUpload: (filename: string) => void
}

export const VideoUpload = ({ onUpload }: VideoUploadProps) => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { filename } = await uploadVideo(file, setProgress)
      onUpload(filename)
    } catch (e) {
      console.log(e)
      setError('Ошибка при загрузке видео')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-container">
      <label htmlFor="video-input" className="upload-btn">
        Выбрать видео
      </label>
      <input
        id="video-input"
        type="file"
        accept="video/*"
        hidden
        onChange={handleChange}
      />
      {loading && (
        <div>
          <progress value={progress} max={100} className="progress-bar" />
          <span className="progress-label">{progress}%</span>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
