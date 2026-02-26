import { useState } from "react"
import { uploadVideo } from "../api/video"
import { Box, Button, LinearProgress, Typography } from "@mui/material"


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
    <Box display="flex" flexDirection="column" gap={2} >
      <Button variant="contained" component="label" htmlFor="video-input">
        Выбрать видео
      </Button>
      <input
        id="video-input"
        type="file"
        accept="video/*"
        hidden
        onChange={handleChange}
      />
      {loading && (
        <Box>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box >
  )
}
