import { useEffect, useState } from "react"
import { getVideoList, getVideoUrl } from "../api/video"
import { Card, Box, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"


interface VideoGridProps {
  onSelect: (filename: string) => void,
  refresh: boolean
}

export const VideoGrid = ({ onSelect, refresh }: VideoGridProps) => {


  const [videos, setVideos] = useState<string[]>([])

  useEffect(() => {
    getVideoList()
      .then(setVideos)
      .catch(console.error)
  }, [refresh])


  return (
    <Box
      sx={{
        columns: { xs: 1, sm: 2, md: 4 },
        columnGap: 2,
      }}
    >
      {videos.map((filename) => (
        <Box
          key={filename}
          sx={{
            breakInside: 'avoid',
            mb: 2,
            display: 'inline-block',
            width: '100%',
          }}
        >
          <Card>
            <CardActionArea onClick={() => onSelect(filename)}>
              <CardMedia
                component="video"
                src={getVideoUrl(filename)}
              />
              {/* <CardContent> */}
              {/*   <Typography variant="body2" noWrap>{filename}</Typography> */}
              {/* </CardContent> */}
            </CardActionArea>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
