<script setup>
import { Volume2, VolumeX, FlipHorizontal, Camera } from 'lucide-vue-next'

defineProps({
  isSoundEnabled: { type: Boolean, default: true },
  isMirrored: { type: Boolean, default: true },
  availableDevices: { type: Array, default: () => [] },
  selectedDeviceId: { type: String, default: '' }
})

const emit = defineEmits(['toggle-sound', 'toggle-mirror', 'update:selectedDeviceId', 'camera-change'])
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mb-4 pixel-panel relative z-10">
    <!-- Brand Info: Digital Blueprint Retro-Tech Style -->
    <div class="flex items-center gap-3">
      <div 
        class="w-10 h-10 flex items-center justify-center bg-[var(--blue-900)] border-2 border-[var(--blue-300)] shadow-[2px_2px_0px_var(--blue-900)] text-[var(--ice)]"
        aria-hidden="true"
      >
        <Camera :size="20" class="text-[var(--ice)]" />
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-pixel text-xs sm:text-sm text-white tracking-wider">
            SAHITYA SADVIMSATIH PHOTOBOOTH
          </h1>
          <span 
            class="text-[9px] bg-[var(--mint)] text-[var(--text-on-light)] font-pixel px-1.5 py-0.5 border border-white"
            aria-label="Versi 1.0"
          >
            v1.0
          </span>
        </div>
        <p class="font-pixel-body text-sm sm:text-base text-[var(--blue-100)] tracking-wide mt-0.5">
          DIGITAL BLUEPRINT EDITION • 3-FRAME STRIP
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2">
      <!-- Sound Switch -->
      <button
        type="button"
        @click="emit('toggle-sound')"
        class="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-pixel"
        :aria-label="isSoundEnabled ? 'Matikan Suara Audio' : 'Aktifkan Suara Audio'"
        :title="isSoundEnabled ? 'BGM ON' : 'MUTE'"
      >
        <Volume2 v-if="isSoundEnabled" :size="13" class="text-[var(--mint)]" aria-hidden="true" />
        <VolumeX v-else :size="13" class="text-[var(--ash)]" aria-hidden="true" />
        <span>{{ isSoundEnabled ? 'SFX: ON' : 'SFX: OFF' }}</span>
      </button>

      <!-- Mirror Switch -->
      <button
        type="button"
        @click="emit('toggle-mirror')"
        class="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-pixel"
        :class="isMirrored ? 'bg-[var(--blue-500)] text-white' : ''"
        aria-label="Cerminkan Kamera Depan"
        title="MIRROR CAMERA"
      >
        <FlipHorizontal :size="13" class="text-[var(--ice)]" aria-hidden="true" />
        <span class="hidden sm:inline">MIRROR</span>
      </button>

      <!-- Camera Selector (if multiple) -->
      <div v-if="availableDevices.length > 1" class="relative">
        <label for="camera-device-select" class="sr-only">Pilih Kamera</label>
        <select
          id="camera-device-select"
          :value="selectedDeviceId"
          @change="(e) => { emit('update:selectedDeviceId', e.target.value); emit('camera-change') }"
          class="bg-[var(--blue-900)] text-[var(--ice)] font-pixel text-[9px] border-2 border-[var(--blue-300)] p-1.5 shadow-[2px_2px_0px_var(--blue-900)] cursor-pointer"
        >
          <option
            v-for="(dev, idx) in availableDevices"
            :key="dev.deviceId"
            :value="dev.deviceId"
          >
            CAM #0{{ idx + 1 }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>
