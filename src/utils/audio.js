// Web Audio API Retro 8-Bit Chiptune Sound Generator

class SoundFX {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // 8-Bit Chiptune Square Wave Pulse
  beep(freq = 440, duration = 0.08, type = 'square') {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch (e) {
      console.warn('Audio play failed', e)
    }
  }

  countdownTick(count) {
    if (count === 1) {
      // High pitch 8-bit coin-like blip
      this.beep(880, 0.12, 'square')
    } else {
      // Retro arcade step blip
      this.beep(440, 0.07, 'square')
    }
  }

  // Retro 8-bit camera snap / laser beam sound
  shutter() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime

      // Fast pitch drop (arcade zap)
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)

      // Short noise burst (white noise hit)
      const bufferSize = this.ctx.sampleRate * 0.06
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.2, now + 0.03)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

      noise.connect(noiseGain)
      noiseGain.connect(this.ctx.destination)
      noise.start(now + 0.03)
    } catch (e) {
      console.warn('Shutter sound error', e)
    }
  }

  // 8-Bit Victory Fanfare / Level Up Arpeggio
  fanfare() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5] // C4 to C6 arpeggio
      const start = this.ctx.currentTime
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, start + idx * 0.07)
        gain.gain.setValueAtTime(0.14, start + idx * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.001, start + idx * 0.07 + 0.18)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(start + idx * 0.07)
        osc.stop(start + idx * 0.07 + 0.2)
      })
    } catch (e) {
      console.warn('Fanfare error', e)
    }
  }
}

export const sound = new SoundFX()
