import { Box } from "@mui/material"
import { getVideoUrl } from "../api/video"


interface VideoPlayerProps {
  filename: string
}

export const VideoPlayer = ({ filename }: VideoPlayerProps) => {


  return (
    <Box margin='0 auto' width="100%" maxWidth={800}>
      <video width="100%" ref={(vol) => { if (vol) vol.volume = 0.3 }} controls src={getVideoUrl(filename)} />
    </Box>
  )
}
