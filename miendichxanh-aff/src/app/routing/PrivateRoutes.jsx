import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const AffsPage = lazy(() => import('../pages/affs'))

function PrivateRoutes() {
  return (
    <>
      <Routes>
        <Route path='aff/*' element={<AffsPage />} />
        <Route index element={<Navigate to='/aff' />} />
      </Routes>
    </>
  )
}

export default PrivateRoutes
