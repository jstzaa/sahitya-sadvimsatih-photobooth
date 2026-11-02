import { ref, onBeforeUnmount } from 'vue'
import confetti from 'canvas-confetti'
import { sound } from '../utils/audio'

export function usePhotobooth(capturePhotoCallback) {
  // states: 'idle' | 'countdown' | 'flash' | 'delay' | 'finished'
  const captureState = ref('idle')
  const currentFrameIndex = ref(0) // 0, 1, 2
  const countdownValue = ref(3)
  const countdownDuration = ref(3) // 3 or 5 seconds
  const capturedPhotos = ref([null, null, null])
  const isFlashing = ref(false)
  let timerId = null

  const startAutoCapture = () => {
    if (captureState.value !== 'idle' && captureState.value !== 'finished') return
    sound.init()

    capturedPhotos.value = [null, null, null]
    currentFrameIndex.value = 0
    captureState.value = 'countdown'
    countdownValue.value = countdownDuration.value

    runCountdown()
  }

  const runCountdown = () => {
    sound.countdownTick(countdownValue.value)

    timerId = setInterval(() => {
      countdownValue.value--

      if (countdownValue.value > 0) {
        sound.countdownTick(countdownValue.value)
      } else {
        clearInterval(timerId)
        executeCapture()
      }
    }, 1000)
  }

  const executeCapture = () => {
    // Flash visual & sound
    isFlashing.value = true
    sound.shutter()

    setTimeout(() => {
      isFlashing.value = false
    }, 220)

    // Capture the photo via callback
    const photoUrl = capturePhotoCallback ? capturePhotoCallback(currentFrameIndex.value) : null
    capturedPhotos.value[currentFrameIndex.value] = photoUrl

    // Sequence check: Frame 1, Frame 2, Frame 3
    if (currentFrameIndex.value < 2) {
      captureState.value = 'delay'
      setTimeout(() => {
        currentFrameIndex.value++
        countdownValue.value = countdownDuration.value
        captureState.value = 'countdown'
        runCountdown()
      }, 1200)
    } else {
      captureState.value = 'finished'
      sound.fanfare()
      triggerConfetti()
    }
  }

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      })
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } })
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } })
      }, 250)
    } catch (e) {
      console.warn('Confetti error', e)
    }
  }

  const resetCapture = () => {
    if (timerId) clearInterval(timerId)
    capturedPhotos.value = [null, null, null]
    currentFrameIndex.value = 0
    captureState.value = 'idle'
  }

  onBeforeUnmount(() => {
    if (timerId) clearInterval(timerId)
  })

  return {
    captureState,
    currentFrameIndex,
    countdownValue,
    countdownDuration,
    capturedPhotos,
    isFlashing,
    startAutoCapture,
    resetCapture
  }
}
