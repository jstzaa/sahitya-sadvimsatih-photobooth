<script setup>
import { Download, RotateCcw } from 'lucide-vue-next'
import { THEMES, STICKERS } from '../constants/photobooth'

defineProps({
  theme: { type: String, default: 'blueprint-classic' },
  sticker: { type: String, default: '⭐' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  hasFinished: { type: Boolean, default: false },
  isDownloading: { type: Boolean, default: false },
  capturedPhotos: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'update:theme',
  'update:sticker',
  'update:title',
  'update:subtitle',
  'download-strip',
  'download-single',
  'retake'
])
</script>

<template>
  <div class="flex flex-col gap-3 pt-3 border-t-2 border-[var(--blue-300)]">
    <!-- Theme Palette Picker (Pixel Tiles) -->
    <div class="flex flex-col gap-1.5">
      <span class="font-pixel text-[9px] text-[var(--ice)]">PILIH TEMA STRIP:</span>
      <div class="flex items-center gap-2 flex-wrap" role="radiogroup" aria-label="Pilihan Tema Strip">
        <button
          v-for="t in THEMES"
          :key="t.id"
          type="button"
          @click="emit('update:theme', t.id)"
          class="w-7 h-7 border-2 border-white flex items-center justify-center transition-transform shadow-[2px_2px_0px_var(--blue-900)] cursor-pointer"
          :class="theme === t.id ? 'scale-110 ring-2 ring-[var(--mint)]' : 'hover:scale-105'"
          :style="{ backgroundColor: t.bg }"
          :aria-label="`Tema ${t.name}`"
          :title="t.name"
        >
          <span v-if="theme === t.id" class="text-[9px] font-pixel text-white drop-shadow-[1px_1px_0px_#000]" aria-hidden="true">★</span>
        </button>
      </div>
    </div>

    <!-- Sticker / Stamp Picker (Pixel Tiles) -->
    <div class="flex flex-col gap-1.5">
      <span class="font-pixel text-[9px] text-[var(--ice)]">STIKER / STEMPEL:</span>
      <div class="flex items-center gap-1.5 flex-wrap" role="radiogroup" aria-label="Pilihan Stiker">
        <button
          v-for="stk in STICKERS"
          :key="stk"
          type="button"
          @click="emit('update:sticker', sticker === stk ? '' : stk)"
          class="w-7 h-7 bg-[var(--blue-900)] border-2 border-[var(--blue-300)] flex items-center justify-center text-sm cursor-pointer shadow-[2px_2px_0px_var(--blue-900)] transition-all"
          :class="sticker === stk ? 'bg-[var(--mint)] ring-2 ring-white scale-110' : 'hover:bg-[var(--blue-700)]'"
          :aria-label="`Pilih stiker ${stk}`"
        >
          {{ stk }}
        </button>
      </div>
    </div>

    <!-- Title and Subtitle Inputs (Digital Blueprint Style) -->
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <label for="strip-title-input" class="font-pixel text-[8px] text-[var(--blue-100)]">JUDUL:</label>
        <input
          id="strip-title-input"
          type="text"
          :value="title"
          @input="emit('update:title', $event.target.value)"
          placeholder="SAHITYA PHOTO"
          class="bg-[rgba(36,90,140,0.85)] border-2 border-[var(--blue-300)] text-white placeholder-[var(--blue-300)] font-pixel text-[9px] px-2 py-1.5 shadow-[2px_2px_0px_var(--blue-900)]"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="strip-subtitle-input" class="font-pixel text-[8px] text-[var(--blue-100)]">SUBJUDUL:</label>
        <input
          id="strip-subtitle-input"
          type="text"
          :value="subtitle"
          @input="emit('update:subtitle', $event.target.value)"
          placeholder="BLUEPRINT STRIP"
          class="bg-[rgba(36,90,140,0.85)] border-2 border-[var(--blue-300)] text-white placeholder-[var(--blue-300)] font-pixel text-[9px] px-2 py-1.5 shadow-[2px_2px_0px_var(--blue-900)]"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-2 pt-1">
      <button
        type="button"
        @click="emit('download-strip')"
        :disabled="!hasFinished || isDownloading"
        class="btn-primary flex-2 flex items-center justify-center gap-1.5 py-2.5 px-3 text-[9px]"
        aria-label="Simpan Strip Foto dalam Format PNG"
      >
        <Download :size="13" class="text-[var(--text-on-light)]" aria-hidden="true" />
        <span>{{ isDownloading ? 'MENYIMPAN...' : 'SAVE STRIP (PNG)' }}</span>
      </button>

      <button
        type="button"
        @click="emit('retake')"
        :disabled="!capturedPhotos[0]"
        class="btn-secondary flex-1 flex items-center justify-center gap-1 py-2 px-2 text-[9px]"
        aria-label="Ambil Ulang Semua Foto"
      >
        <RotateCcw :size="12" aria-hidden="true" />
        <span>RETAKE</span>
      </button>
    </div>

    <!-- Individual Frame Downloads -->
    <div v-if="capturedPhotos[0]" class="flex items-center justify-between p-2 bg-[var(--blue-900)] border-2 border-[var(--blue-300)] shadow-[2px_2px_0px_var(--blue-900)]">
      <span class="font-pixel text-[8px] text-[var(--blue-100)]">UNDUH PER FRAME:</span>
      <div class="flex gap-1.5">
        <button
          v-for="(photo, i) in capturedPhotos"
          :key="i"
          type="button"
          :disabled="!photo"
          @click="emit('download-single', i)"
          class="pixel-chip px-2 py-0.5 text-[8px] font-pixel disabled:opacity-40"
          :aria-label="`Unduh Foto Frame ${i + 1}`"
        >
          F{{ i + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>
