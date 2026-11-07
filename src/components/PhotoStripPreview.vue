<script setup>
import { Camera } from 'lucide-vue-next'
import frameImg from '../assets/frame.webp'

defineProps({
  capturedPhotos: { type: Array, default: () => [null, null, null] },
  filterCss: { type: String, default: 'none' }
})

const slots = [
  { left: '8.6667%', top: '17.8333%', width: '82.6667%', height: '20.8889%' },
  { left: '8.6667%', top: '41.4444%', width: '82.6667%', height: '20.4444%' },
  { left: '8.6667%', top: '65.0000%', width: '82.6667%', height: '20.4444%' }
]
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Compact Fit Preview Box -->
    <div
      class="flex justify-center items-center p-2.5 sm:p-3 bg-[rgba(29,63,99,0.5)] border-2 border-[var(--blue-300)] shadow-[3px_3px_0px_var(--blue-900)]"
    >
      <!-- Frame Strip Container (Fit 1:3 ratio) -->
      <div
        class="relative w-[150px] sm:w-[165px] aspect-[1/3] shadow-[3px_3px_0px_rgba(36,90,140,0.8)] border-2 sm:border-3 border-white shrink-0 bg-[#1D3F63] overflow-hidden select-none"
      >
        <!-- 3 Photo Slots (Layered behind frame.png) -->
        <div
          v-for="(slot, index) in slots"
          :key="index"
          class="absolute overflow-hidden flex items-center justify-center bg-[#245A8C]"
          :style="{
            left: slot.left,
            top: slot.top,
            width: slot.width,
            height: slot.height
          }"
        >
          <!-- Captured Photo -->
          <img
            v-if="capturedPhotos[index]"
            :src="capturedPhotos[index]"
            :alt="`Hasil Frame Foto ${index + 1}`"
            class="w-full h-full object-cover block"
            style="image-rendering: pixelated;"
            :style="{ filter: filterCss }"
          />

          <!-- Waiting Placeholder -->
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-[var(--blue-900)] text-[var(--ice)]"
          >
            <Camera :size="15" class="opacity-60 mb-0.5 text-[var(--mint)]" aria-hidden="true" />
            <span class="font-pixel text-[6px] text-[var(--ice)] tracking-wider">
              [ FRAME 0{{ index + 1 }} ]
            </span>
            <span class="font-pixel-body text-[9px] text-[var(--mint)] opacity-85">
              MENUNGGU
            </span>
          </div>
        </div>

        <!-- Frame Graphic Overlay -->
        <img
          :src="frameImg"
          alt="Frame Strip Sahitya Sadvimsatih"
          class="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 block"
        />
      </div>
    </div>
  </div>
</template>
