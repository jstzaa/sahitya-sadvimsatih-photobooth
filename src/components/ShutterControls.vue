<script setup>
import { Camera, Palette, Timer } from 'lucide-vue-next'
import { FILTERS } from '../constants/photobooth'

defineProps({
  captureState: { type: String, default: 'idle' },
  currentFrameIndex: { type: Number, default: 0 },
  countdownDuration: { type: Number, default: 3 },
  activeFilter: { type: String, default: 'none' },
  isCameraReady: { type: Boolean, default: true }
})

const emit = defineEmits([
  'start-capture',
  'update:countdownDuration',
  'update:activeFilter'
])
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Top options: Filter Chips & Timer Duration Selector -->
    <div class="flex flex-wrap items-center justify-between gap-2.5">
      <!-- Filter Chips -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-[9px] font-pixel text-[var(--ice)] flex items-center gap-1 mr-0.5">
          <Palette :size="12" class="text-[var(--mint)]" aria-hidden="true" />
          FILTER:
        </span>
        <button
          v-for="f in FILTERS"
          :key="f.id"
          type="button"
          @click="emit('update:activeFilter', f.id)"
          class="pixel-chip px-2 py-1 text-[8px] font-pixel"
          :class="{ active: activeFilter === f.id }"
          :aria-pressed="activeFilter === f.id"
        >
          {{ f.name }}
        </button>
      </div>

      <!-- Duration (3s vs 5s) -->
      <div
        v-if="captureState === 'idle' || captureState === 'finished'"
        class="flex items-center gap-1 bg-[rgba(36,90,140,0.5)] p-1 border-2 border-[var(--blue-300)] shadow-[2px_2px_0px_var(--blue-900)]"
      >
        <span class="text-[8px] font-pixel text-[var(--blue-100)] flex items-center gap-1 px-1">
          <Timer :size="11" class="text-[var(--mint)]" aria-hidden="true" />
          TIMER:
        </span>
        <button
          type="button"
          @click="emit('update:countdownDuration', 3)"
          class="pixel-chip px-2 py-0.5 text-[8px] font-pixel"
          :class="{ active: countdownDuration === 3 }"
          :aria-pressed="countdownDuration === 3"
        >
          3S
        </button>
        <button
          type="button"
          @click="emit('update:countdownDuration', 5)"
          class="pixel-chip px-2 py-0.5 text-[8px] font-pixel"
          :class="{ active: countdownDuration === 5 }"
          :aria-pressed="countdownDuration === 5"
        >
          5S
        </button>
      </div>
    </div>

    <!-- Shutter Button Trigger Area -->
    <div class="flex justify-center pt-1">
      <!-- Ready / Idle State Trigger (DESIGN.md Section 7: Primary SNAP) -->
      <button
        v-if="captureState === 'idle' || captureState === 'finished'"
        type="button"
        @click="emit('start-capture')"
        class="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 text-xs sm:text-sm tracking-wider"
        aria-label="Ambil 3 Foto Berurutan"
      >
        <Camera :size="18" class="text-[var(--text-on-light)]" aria-hidden="true" />
        <div class="flex flex-col text-left">
          <span>
            {{ captureState === 'finished' ? 'SNAP AGAIN (3 SHOTS)' : 'SNAP PHOTO (3 SHOTS)' }}
          </span>
          <span class="font-pixel-body text-xs sm:text-sm opacity-90">
            PRESS SPACE OR CLICK
          </span>
        </div>
      </button>

      <!-- Capturing / Running Indicator -->
      <div
        v-else
        class="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[var(--blue-900)] text-[var(--mint)] font-pixel text-[10px] border-4 border-[var(--mint)] shadow-[4px_4px_0px_rgba(36,90,140,0.8)]"
        role="status"
        aria-live="polite"
      >
        <div class="w-3 h-3 bg-[var(--danger)] animate-pixel-blink" aria-hidden="true"></div>
        <span>CAPTURING FRAME #0{{ currentFrameIndex + 1 }} OF 3...</span>
      </div>
    </div>
  </div>
</template>
