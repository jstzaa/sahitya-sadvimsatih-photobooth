<script setup>
import { ref, watch, onMounted } from 'vue'
import { RotateCcw, AlertCircle, Smile } from 'lucide-vue-next'

// Decorative Pixel Overlays (anchored to viewfinder corners)
import decoTL from '@/assets/1-1.png'
import decoTR from '@/assets/2-1.png'
import decoBR from '@/assets/3-1.png'
import decoBL from '@/assets/4-1.png'

const props = defineProps({
  stream: { type: Object, default: null },
  isCameraReady: { type: Boolean, default: false },
  cameraError: { type: String, default: '' },
  isMirrored: { type: Boolean, default: true },
  isDemoMode: { type: Boolean, default: false },
  filterCss: { type: String, default: 'none' },
  captureState: { type: String, default: 'idle' },
  currentFrameIndex: { type: Number, default: 0 },
  countdownValue: { type: Number, default: 3 },
  capturedPhotos: { type: Array, default: () => [null, null, null] },
  isFlashing: { type: Boolean, default: false }
})

const emit = defineEmits(['retry-camera', 'activate-demo'])

const videoEl = ref(null)

const attachStream = () => {
  if (videoEl.value && props.stream) {
    if (videoEl.value.srcObject !== props.stream) {
      videoEl.value.srcObject = props.stream
    }
    const playPromise = videoEl.value.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Video auto-play interrupted:', err)
      })
    }
  }
}

watch(
  [() => props.stream, () => props.isCameraReady],
  () => {
    attachStream()
  },
  { immediate: true }
)

onMounted(() => {
  attachStream()
})

defineExpose({
  videoEl
})
</script>

<template>
  <div class="relative mx-auto w-full max-w-[440px] aspect-[4/3] sm:aspect-[4/5] max-h-[380px] bg-[var(--blue-900)] camera-double-frame overflow-hidden flex items-center justify-center select-none">
    <!-- Viewfinder Corner Pixel Decorations (DESIGN.md Section 2) -->
    <img :src="decoTL" class="deco-vf deco-vf-tl" alt="" aria-hidden="true" />
    <img :src="decoTR" class="deco-vf deco-vf-tr" alt="" aria-hidden="true" />
    <img :src="decoBR" class="deco-vf deco-vf-br" alt="" aria-hidden="true" />
    <img :src="decoBL" class="deco-vf deco-vf-bl" alt="" aria-hidden="true" />

    <!-- Pixel L-Corner Markers (DESIGN.md Section 7) -->
    <div class="pixel-corner-l pixel-corner-tl" aria-hidden="true"></div>
    <div class="pixel-corner-l pixel-corner-tr" aria-hidden="true"></div>
    <div class="pixel-corner-l pixel-corner-bl" aria-hidden="true"></div>
    <div class="pixel-corner-l pixel-corner-br" aria-hidden="true"></div>

    <!-- Subtle Blueprint Composition Grid (3x3 Rule of Thirds) -->
    <div class="camera-blueprint-grid" aria-hidden="true"></div>

    <!-- Camera Flash Effect -->
    <div
      v-if="isFlashing"
      class="absolute inset-0 bg-white z-50 pointer-events-none animate-flash"
      aria-hidden="true"
    ></div>

    <!-- Live WebRTC Video -->
    <video
      v-show="!isDemoMode && isCameraReady"
      ref="videoEl"
      autoplay
      playsinline
      muted
      @loadedmetadata="attachStream"
      @canplay="attachStream"
      class="w-full h-full object-cover transition-[filter] duration-200"
      :class="{ '-scale-x-100': isMirrored }"
      :style="{ filter: filterCss }"
    ></video>

    <!-- Demo Simulation View -->
    <div
      v-if="isDemoMode"
      class="flex flex-col items-center justify-center w-full h-full p-4 text-center bg-[var(--blue-900)] text-white"
      :style="{ filter: filterCss }"
    >
      <div 
        class="p-3 mb-2 bg-[var(--blue-700)] border-2 border-[var(--blue-300)] shadow-[3px_3px_0px_var(--blue-900)] text-[var(--mint)]"
        aria-hidden="true"
      >
        <Smile :size="38" />
      </div>
      <h3 class="font-pixel text-[11px] text-[var(--mint)] mb-1">[ DEMO MODE ACTIVE ]</h3>
      <p class="font-pixel-body text-base text-[var(--blue-100)] max-w-xs">
        VIRTUAL PREVIEW FOR 3-FRAME AUTO CAPTURE
      </p>
    </div>

    <!-- Error Screen (e.g. permission denied) -->
    <div
      v-if="cameraError && !isDemoMode"
      class="absolute inset-0 bg-[var(--blue-900)] flex flex-col items-center justify-center p-4 text-center z-30 gap-2 border-4 border-[var(--danger)] text-white"
      role="alert"
    >
      <AlertCircle :size="32" class="text-[var(--danger)] animate-pixel-blink" aria-hidden="true" />
      <h3 class="font-pixel text-xs text-[var(--danger)]">[ CAMERA NOT DETECTED ]</h3>
      <p class="font-pixel-body text-base text-[var(--blue-100)] max-w-xs leading-tight">
        {{ cameraError }}
      </p>
      <div class="flex items-center gap-2 mt-2">
        <button
          type="button"
          @click="emit('retry-camera')"
          class="btn-primary text-[9px] py-2 px-3"
        >
          <RotateCcw :size="12" class="mr-1 inline" aria-hidden="true" />
          RETRY
        </button>
        <button
          type="button"
          @click="emit('activate-demo')"
          class="btn-secondary text-[9px] py-2 px-3"
        >
          TRY DEMO
        </button>
      </div>
    </div>

    <!-- Countdown Overlay: Display 96px Putih + Glow (DESIGN.md Section 7) -->
    <div
      v-if="captureState === 'countdown'"
      class="absolute inset-0 bg-[rgba(29,63,99,0.7)] backdrop-blur-xs flex flex-col items-center justify-center z-40 text-center"
      aria-live="assertive"
      role="status"
    >
      <div 
        class="font-pixel text-[96px] sm:text-[112px] text-white leading-none animate-countdown-step"
        style="text-shadow: 0 0 24px var(--blue-100), 4px 4px 0px var(--blue-900);"
      >
        {{ countdownValue }}
      </div>
      <div class="mt-3 px-3 py-1 bg-[var(--blue-900)] border-2 border-[var(--mint)] text-[var(--mint)] font-pixel text-[10px] tracking-wider shadow-[3px_3px_0px_var(--blue-900)]">
        FRAME #0{{ currentFrameIndex + 1 }} GET READY!
      </div>
    </div>

    <!-- Delay / Next Pose Breather Overlay -->
    <div
      v-if="captureState === 'delay'"
      class="absolute inset-0 bg-[rgba(29,63,99,0.85)] flex flex-col items-center justify-center z-40 text-center"
      aria-live="assertive"
      role="status"
    >
      <div class="text-center">
        <div class="font-pixel text-base sm:text-lg text-[var(--mint)] animate-pixel-blink mb-2">
          ★ NEXT POSE ★
        </div>
        <div class="font-pixel-body text-base text-[var(--blue-100)] px-3 py-1 bg-[var(--blue-900)] border-2 border-[var(--blue-300)] shadow-[2px_2px_0px_var(--blue-900)]">
          PREPARING FRAME #0{{ currentFrameIndex + 2 }}...
        </div>
      </div>
    </div>

    <!-- Frame Progress Indicators (DESIGN.md) -->
    <div class="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-[var(--blue-900)] border-2 border-[var(--blue-300)] shadow-[3px_3px_0px_var(--blue-900)] z-20">
      <div
        v-for="(photo, idx) in capturedPhotos"
        :key="idx"
        class="flex items-center gap-1.5 text-[9px] font-pixel"
        :class="[
          photo !== null 
            ? 'text-[var(--mint)]' 
            : (currentFrameIndex === idx && captureState !== 'idle' && captureState !== 'finished' 
                ? 'text-[var(--warning)] animate-pixel-blink' 
                : 'text-[var(--blue-300)]')
        ]"
      >
        <span
          class="w-4 h-4 border flex items-center justify-center text-[8px]"
          :class="[
            photo !== null 
              ? 'bg-[var(--mint)] text-[var(--text-on-light)] border-white font-bold' 
              : (currentFrameIndex === idx && captureState !== 'idle' && captureState !== 'finished' 
                  ? 'bg-[var(--warning)] text-[var(--text-on-light)] border-white font-bold' 
                  : 'bg-[var(--blue-700)] text-[var(--blue-100)] border-[var(--blue-300)]')
          ]"
        >
          {{ photo !== null ? '✓' : idx + 1 }}
        </span>
        <span class="hidden sm:inline">FRAME {{ idx + 1 }}</span>
      </div>
    </div>
  </div>
</template>
