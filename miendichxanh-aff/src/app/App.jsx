import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    outer.style.msOverflowStyle = 'scrollbar'
    document.body.appendChild(outer)
    const inner = document.createElement('div')
    outer.appendChild(inner)
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
    outer.parentNode.removeChild(outer)
    document.documentElement.style.setProperty('--width-scroll', scrollbarWidth + 'px')
  }, [])
  
  return (
    <LazyMotion features={domAnimation}>
      <Outlet />
      <ToastContainer
        autoClose={1000}
        rtl={false}
        closeOnClick
        position='top-center'
        theme='colored'
        icon={({ type }) => {
          if (type === "default") {
            return <div className='Toastify__spinner'></div>
          }
          return undefined
        }}
      />
    </LazyMotion>
  )
}

export default App
