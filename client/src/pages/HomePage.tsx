import { Box, Container, Typography } from "@mui/material"
import { useState } from "react"
import { VideoUpload } from "../components/VideoUpload"
import { VideoPlayer } from "../components/VideoPlayer"
import { VideoGrid } from "../components/VideoGrid"


export const HomePage = () => {
  const [filename, setFilename] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(false)

  const handleUpload = (uploadedFilename: string) => {
    setFilename(uploadedFilename)
    setRefresh(prev => !prev)
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" gap={4} py={4}>
        <Typography variant="h4">Стриминг видео</Typography>
        <VideoUpload onUpload={handleUpload} />
        {filename && <VideoPlayer filename={filename} />}
        <VideoGrid onSelect={setFilename} refresh={refresh} />
      </Box>
    </Container>
  )
}
