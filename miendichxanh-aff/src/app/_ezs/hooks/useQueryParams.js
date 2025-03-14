import { useSearchParams } from 'react-router-dom'

const useQueryParams = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  return searchParamsObject
}

export default useQueryParams
