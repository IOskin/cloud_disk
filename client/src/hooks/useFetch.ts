import { useState, useEffect } from "react";

const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json() as T;
        setData(json);
      } catch {
        setError('Ошибка при загрузке')
        console.error('err');
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading }
};

export default useFetch
