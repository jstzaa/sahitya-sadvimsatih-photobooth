<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Image as ImageIcon } from 'lucide-vue-next'

// Components
import HeaderNav from './components/HeaderNav.vue'
import CameraViewfinder from './components/CameraViewfinder.vue'
import ShutterControls from './components/ShutterControls.vue'
import PhotoStripPreview from './components/PhotoStripPreview.vue'
import StripCustomizer from './components/StripCustomizer.vue'

// Composables & Utils
import { useCamera } from './composables/useCamera'
import { usePhotobooth } from './composables/usePhotobooth'
import { FILTERS } from './constants/photobooth'
import { sound } from './utils/audio'
import { generateStripCanvas } from './utils/stripGenerator'

// Sound State
const isSoundEnabled = ref(true)
const toggleSound = () => {
  isSoundEnabled.value = !isSoundEnabled.value
  sound.enabled = isSoundEnabled.value
}

// Camera Composable
const camera = useCamera()
const cameraViewfinderRef = ref(null)

// Capture callback using camera viewfinder's video element
const handleCaptureFrame = (frameIndex) => {
  const videoEl = cameraViewfinderRef.value?.videoEl
  return camera.capturePhoto(frameIndex, videoEl)
}

// Photobooth Composable
const photobooth = usePhotobooth(handleCaptureFrame)

// Camera & Strip Filter State
const activeFilter = ref('none')

// Active Filter CSS
const activeFilterCss = computed(() => {
  const f = FILTERS.find((item) => item.id === activeFilter.value)
  return f ? f.css : 'none'
})

// Download Strip as High-Resolution PNG (600 x 1800)
const isDownloading = ref(false)
const downloadStrip = async () => {
  if (!photobooth.capturedPhotos.value[2]) return
  isDownloading.value = true

  try {
    const canvas = await generateStripCanvas({
      photos: photobooth.capturedPhotos.value,
      filterCss: activeFilterCss.value
    })

    const link = document.createElement('a')
    const fileName = `Photobooth_Sahitya_Strip_${Date.now()}.png`
    link.download = fileName
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Download strip failed:', err)
  } finally {
    isDownloading.value = false
  }
}

// Download single photo frame
const downloadSinglePhoto = (index) => {
  const photo = photobooth.capturedPhotos.value[index]
  if (!photo) return
  const link = document.createElement('a')
  link.download = `Blueprint_Frame_${index + 1}_${Date.now()}.png`
  link.href = photo
  link.click()
}

// Keyboard shortcut (Space to start)
const handleKeyDown = (e) => {
  if (
    e.code === 'Space' &&
    (photobooth.captureState.value === 'idle' || photobooth.captureState.value === 'finished')
  ) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return
    e.preventDefault()
    photobooth.startAutoCapture()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <!-- Main Content Stage -->
    <div class="relative z-10 flex flex-col min-h-screen px-3 py-3 sm:px-6 md:px-10 max-w-[1360px] mx-auto justify-between">
      <!-- Top Navigation -->
      <HeaderNav
        :is-sound-enabled="isSoundEnabled"
        :is-mirrored="camera.isMirrored.value"
        :available-devices="camera.availableDevices.value"
        v-model:selected-device-id="camera.selectedDeviceId.value"
        @toggle-sound="toggleSound"
        @toggle-mirror="camera.isMirrored.value = !camera.isMirrored.value"
        @camera-change="camera.initCamera"
      />

      <!-- Main Workspace Studio Grid -->
      <main class="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-5 flex-1 items-start">
        <!-- LEFT COLUMN: Camera & Shutter Controls -->
        <section class="flex flex-col">
          <div class="flex flex-col gap-3.5 p-4 sm:p-5 pixel-panel">
            <!-- Viewfinder Header Status Badge -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 px-3 py-1 bg-[var(--blue-900)] border-2 border-[var(--blue-300)] shadow-[2px_2px_0px_var(--blue-900)] font-pixel text-[9px]">
                <span
                  class="w-2.5 h-2.5"
                  :class="[
                    photobooth.captureState.value === 'countdown' || photobooth.captureState.value === 'delay'
                      ? 'bg-[var(--danger)] animate-pixel-blink'
                      : 'bg-[var(--mint)]'
                  ]"
                  aria-hidden="true"
                ></span>
                <span v-if="photobooth.captureState.value === 'idle'" class="text-[var(--mint)]">
                  STATUS: SIAP FOTO
                </span>
                <span v-else-if="photobooth.captureState.value === 'countdown' || photobooth.captureState.value === 'delay'" class="text-[var(--warning)]">
                  MEREKAM: FRAME #0{{ photobooth.currentFrameIndex.value + 1 }} / 03
                </span>
                <span v-else-if="photobooth.captureState.value === 'finished'" class="text-[var(--ice)]">
                  ★ 3 FRAME SELESAI ★
                </span>
              </div>

              <span class="font-pixel text-[8px] text-[var(--blue-100)] hidden sm:inline tracking-wider">
                [ 3 FRAME AUTO-CAPTURE ]
              </span>
            </div>

            <!-- Live Camera Viewfinder Component -->
            <CameraViewfinder
              ref="cameraViewfinderRef"
              :stream="camera.stream.value"
              :is-camera-ready="camera.isCameraReady.value"
              :camera-error="camera.cameraError.value"
              :is-mirrored="camera.isMirrored.value"
              :is-demo-mode="camera.isDemoMode.value"
              :filter-css="activeFilterCss"
              :capture-state="photobooth.captureState.value"
              :current-frame-index="photobooth.currentFrameIndex.value"
              :countdown-value="photobooth.countdownValue.value"
              :captured-photos="photobooth.capturedPhotos.value"
              :is-flashing="photobooth.isFlashing.value"
              @retry-camera="camera.initCamera"
              @activate-demo="camera.activateDemoMode"
            />

            <!-- Shutter Action Controls Component -->
            <ShutterControls
              :capture-state="photobooth.captureState.value"
              :current-frame-index="photobooth.currentFrameIndex.value"
              v-model:countdown-duration="photobooth.countdownDuration.value"
              v-model:active-filter="activeFilter"
              :is-camera-ready="camera.isCameraReady.value"
              @start-capture="photobooth.startAutoCapture"
            />
          </div>
        </section>

        <!-- RIGHT COLUMN: 3-Frame Photobooth Strip Result & Action Controls -->
        <section class="flex flex-col">
          <div class="flex flex-col gap-3.5 p-4 sm:p-5 pixel-panel">
            <!-- Strip Header -->
            <div class="flex items-center justify-between">
              <h2 class="font-pixel text-[11px] text-[var(--mint)] flex items-center gap-1.5">
                <ImageIcon :size="13" class="text-[var(--mint)]" aria-hidden="true" />
                HASIL STRIP FOTO
              </h2>
              <span
                v-if="photobooth.capturedPhotos.value[2]"
                class="font-pixel text-[8px] text-[var(--mint)] bg-[var(--blue-900)] border border-[var(--mint)] px-2 py-0.5"
              >
                [ LENGKAP ]
              </span>
              <span
                v-else
                class="font-pixel text-[8px] text-[var(--blue-100)] bg-[var(--blue-900)] border border-[var(--blue-300)] px-2 py-0.5"
              >
                [ MENUNGGU ]
              </span>
            </div>

            <!-- Physical 3-Photo Strip Preview Component (Fit View) -->
            <PhotoStripPreview
              :captured-photos="photobooth.capturedPhotos.value"
              :filter-css="activeFilterCss"
            />

            <!-- Strip Action Controls Component -->
            <StripCustomizer
              :has-finished="photobooth.captureState.value === 'finished' || !!photobooth.capturedPhotos.value[2]"
              :is-downloading="isDownloading"
              :captured-photos="photobooth.capturedPhotos.value"
              @download-strip="downloadStrip"
              @download-single="downloadSinglePhoto"
              @retake="photobooth.resetCapture"
            />
          </div>
        </section>
      </main>

      <!-- App Footer Digital Blueprint Style -->
      <footer class="py-3 text-center font-pixel text-[8px] text-[var(--blue-100)] mt-3 select-none">
        SAHITYA SADVIMSATIH PHOTOBOOTH • DIGITAL BLUEPRINT EDITION
      </footer>
    </div>
  </div>
</template>
