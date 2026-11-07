<script setup>
import { Download, RotateCcw } from 'lucide-vue-next'

defineProps({
  hasFinished: { type: Boolean, default: false },
  isDownloading: { type: Boolean, default: false },
  capturedPhotos: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'download-strip',
  'download-single',
  'retake'
])
</script>

<template>
  <div class="flex flex-col gap-3 pt-3 border-t-2 border-[var(--blue-300)]">
    <!-- Primary Action Buttons: Save & Retake -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="emit('download-strip')"
        :disabled="!hasFinished || isDownloading"
        class="btn-primary flex-2 flex items-center justify-center gap-2 py-3 px-4 text-[10px]"
        aria-label="Simpan Strip Foto dalam Format PNG (600 x 1800)"
      >
        <Download :size="14" class="text-[var(--text-on-light)]" aria-hidden="true" />
        <span>{{ isDownloading ? 'MENYIMPAN...' : 'SAVE STRIP' }}</span>
      </button>

      <button
        type="button"
        @click="emit('retake')"
        :disabled="!capturedPhotos[0]"
        class="btn-secondary flex-1 flex items-center justify-center gap-1.5 py-3 px-3 text-[10px]"
        aria-label="Ambil Ulang Semua Foto"
      >
        <RotateCcw :size="13" aria-hidden="true" />
        <span>RETAKE</span>
      </button>
    </div>

    <!-- Individual Frame Downloads -->
    <div
      v-if="capturedPhotos[0]"
      class="flex items-center justify-between p-2.5 bg-[var(--blue-900)] border-2 border-[var(--blue-300)] shadow-[2px_2px_0px_var(--blue-900)]"
    >
      <span class="font-pixel text-[8px] text-[var(--blue-100)]">SAVE PER FRAME:</span>
      <div class="flex gap-2">
        <button
          v-for="(photo, i) in capturedPhotos"
          :key="i"
          type="button"
          :disabled="!photo"
          @click="emit('download-single', i)"
          class="pixel-chip px-2.5 py-1 text-[8px] font-pixel disabled:opacity-40"
          :aria-label="`Unduh Foto Frame ${i + 1}`"
        >
          F{{ i + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>
