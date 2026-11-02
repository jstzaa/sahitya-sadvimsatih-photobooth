<script setup>
import { computed } from 'vue'
import { Camera } from 'lucide-vue-next'
import { THEMES } from '../constants/photobooth'

const props = defineProps({
  capturedPhotos: { type: Array, default: () => [null, null, null] },
  currentThemeId: { type: String, default: 'blueprint-classic' },
  filterCss: { type: String, default: 'none' },
  title: { type: String, default: 'SAHITYA PHOTO' },
  subtitle: { type: String, default: 'BLUEPRINT STRIP' },
  sticker: { type: String, default: '⭐' },
  showDate: { type: Boolean, default: true },
  dateText: { type: String, default: '' }
})

const activeTheme = computed(() => {
  return THEMES.find((t) => t.id === props.currentThemeId) || THEMES[0]
})

const formattedDate = computed(() => {
  return (
    props.dateText ||
    new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.')
  )
})
</script>

<template>
  <div class="flex justify-center p-3 bg-[rgba(29,63,99,0.5)] border-2 border-[var(--blue-300)] shadow-[3px_3px_0px_var(--blue-900)] max-h-[380px] overflow-y-auto">
    <!-- Physical Vertical Photo Strip Structure (DESIGN.md Section 7) -->
    <div
      class="w-[210px] p-2.5 pb-4 flex flex-col shadow-[4px_4px_0px_rgba(36,90,140,0.8)] border-[6px] border-white transition-all shrink-0"
      :style="{
        backgroundColor: activeTheme.bg,
        color: activeTheme.text
      }"
    >
      <!-- 3 Photo Frames -->
      <div class="flex flex-col gap-2">
        <div
          v-for="(photo, index) in capturedPhotos"
          :key="index"
          class="relative w-full aspect-[4/3] overflow-hidden border-2 border-white/80 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
          :style="{
            backgroundColor: activeTheme.cardBg
          }"
        >
          <!-- Captured Photo -->
          <img
            v-if="photo"
            :src="photo"
            :alt="`Hasil Frame Foto ${index + 1}`"
            class="w-full h-full object-cover block"
            style="image-rendering: pixelated;"
            :style="{ filter: filterCss }"
          />

          <!-- Placeholder when waiting for capture -->
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center p-2 text-center"
          >
            <Camera :size="20" class="opacity-60 mb-1" aria-hidden="true" />
            <span class="font-pixel text-[8px] tracking-wider">[ FRAME 0{{ index + 1 }} ]</span>
            <span class="font-pixel-body text-xs opacity-75 mt-0.5">MENUNGGU...</span>
          </div>

          <!-- Pixel Tag Badge #01, #02, #03 -->
          <div 
            class="absolute top-1 right-1 bg-[var(--blue-900)] text-[var(--ice)] font-pixel text-[7px] px-1 py-0.5 border border-[var(--blue-300)] shadow-[1px_1px_0px_var(--blue-900)]"
            aria-hidden="true"
          >
            #0{{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Strip Footer Branding & Stamps -->
      <div class="pt-3 text-center flex flex-col items-center gap-1">
        <h3 class="font-pixel text-[9px] tracking-tight leading-tight">
          {{ title || 'SAHITYA PHOTO' }}
        </h3>
        <p
          class="font-pixel-body text-xs leading-tight font-semibold"
          :style="{ color: activeTheme.subText }"
        >
          {{ subtitle || 'BLUEPRINT STRIP' }}
        </p>

        <!-- Date Stamp in Pixel Monospace -->
        <p
          v-if="showDate"
          class="font-pixel text-[7px] mt-0.5 tracking-wider"
          :style="{ color: activeTheme.subText }"
        >
          ★ {{ formattedDate }} ★
        </p>

        <!-- Cute Pixel Sticker / Glyph -->
        <div v-if="sticker" class="text-lg mt-0.5 select-none" aria-hidden="true">
          {{ sticker }}
        </div>
      </div>
    </div>
  </div>
</template>
