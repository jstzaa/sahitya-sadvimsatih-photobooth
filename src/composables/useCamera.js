import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useCamera() {
  const videoRef = ref(null)
  const stream = ref(null)
  const isCameraReady = ref(false)
  const cameraError = ref('')
  const isMirrored = ref(true)
  const availableDevices = ref([])
  const selectedDeviceId = ref('')
  const isDemoMode = ref(false)

  const initCamera = async () => {
    cameraError.value = ''
    try {
      if (stream.value) {
        stream.value.getTracks().forEach((track) => track.stop())
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          deviceId: selectedDeviceId.value ? { exact: selectedDeviceId.value } : undefined,
          facingMode: selectedDeviceId.value ? undefined : 'user'
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      stream.value = mediaStream

      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream
        videoRef.value.play().catch((err) => console.warn('Video play warning:', err))
      }

      isCameraReady.value = true
      isDemoMode.value = false
      await getCameras()
    } catch (err) {
      console.error('Camera access error:', err)
      cameraError.value = 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.'
      isCameraReady.value = false
    }
  }

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = devices.filter((d) => d.kind === 'videoinput')
      availableDevices.value = videoInputs
      if (videoInputs.length && !selectedDeviceId.value) {
        selectedDeviceId.value = videoInputs[0].deviceId
      }
    } catch (e) {
      console.warn('Device enumeration error:', e)
    }
  }

  const activateDemoMode = () => {
    isDemoMode.value = true
    cameraError.value = ''
    isCameraReady.value = true
  }

  // Generates fallback mock graphic for testing without camera
  const generateDemoFrame = (index) => {
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')

    const gradients = [
      ['#6366F1', '#EC4899'],
      ['#3B82F6', '#10B981'],
      ['#F59E0B', '#EF4444']
    ]
    const [c1, c2] = gradients[index % gradients.length]
    const grad = ctx.createLinearGradient(0, 0, 640, 480)
    grad.addColorStop(0, c1)
    grad.addColorStop(1, c2)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 640, 480)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 70px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(['✌️ Pose 1', '🌸 Pose 2', '✨ Pose 3'][index], 320, 220)

    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText('Demo Mode • Frame ' + (index + 1) + ' dari 3', 320, 280)

    return canvas.toDataURL('image/png')
  }

  const capturePhoto = (frameIndex, targetVideoEl = null) => {
    if (isDemoMode.value) {
      return generateDemoFrame(frameIndex)
    }
    const video = targetVideoEl || videoRef.value
    if (video) {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext('2d')

      if (isMirrored.value) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg', 0.95)
    }
    return null
  }

  onMounted(() => {
    initCamera()
  })

  onBeforeUnmount(() => {
    if (stream.value) {
      stream.value.getTracks().forEach((track) => track.stop())
    }
  })

  return {
    videoRef,
    stream,
    isCameraReady,
    cameraError,
    isMirrored,
    availableDevices,
    selectedDeviceId,
    isDemoMode,
    initCamera,
    activateDemoMode,
    capturePhoto
  }
}
