import { Suspense } from 'react'
import TopBarProgress from 'react-topbar-progress-indicator'

const SuspensedView = ({ children }) => {
  TopBarProgress.config({
    barColors: {
      0: '#3699ff'
    },
    barThickness: 1,
    shadowBlur: 5
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export default SuspensedView
