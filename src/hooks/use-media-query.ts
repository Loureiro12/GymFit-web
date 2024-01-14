import { useEffect, useState } from 'react'

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('')

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      setDeviceType(isDesktop ? 'desktop' : 'mobile')
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}

export default useDeviceType
