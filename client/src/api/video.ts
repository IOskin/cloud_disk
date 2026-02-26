const BASE_URL = '/api';

export const uploadVideo = async (file: File, onProgress: (progress: number) => void): Promise<{ filename: string }> => {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    const formData = new FormData()
    formData.append('video', file)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText) as { filename: string })
      } else {
        reject(new Error('Ошибка загрузки'))
      }
    }
    xhr.onerror = () => reject(new Error('ощибка сети'))
    xhr.open('POST', `${BASE_URL}/video/upload`)
    xhr.send(formData)
  })
};

export const getVideoUrl = (filename: string): string => {
  return `${BASE_URL}/video/${filename}`
}


export const getVideoList = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/video`)
  return response.json() as Promise<string[]>
}
