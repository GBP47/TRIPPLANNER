import { toPng } from 'html-to-image'
import { trackEvent } from '../../lib/analytics.js'

export default function SaveImageButton({ targetRef }) {
  const handleClick = async () => {
    if (!targetRef.current) return

    try {
      const dataUrl = await toPng(targetRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'trip-itinerary.png'
      link.href = dataUrl
      link.click()
      trackEvent('save_image')
    } catch {
      window.alert('이미지 저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      이미지로 저장
    </button>
  )
}
