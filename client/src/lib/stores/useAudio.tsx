import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  clickSound: HTMLAudioElement | null;
  isMuted: boolean;
  isMusicMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setClickSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  toggleMusicMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playClick: () => void;
  playMusic: () => void;
  stopMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  clickSound: null,
  isMuted: false, // Start unmuted by default
  isMusicMuted: false, // Start music unmuted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setClickSound: (sound) => set({ clickSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },

  toggleMusicMute: () => {
    const { isMusicMuted, backgroundMusic } = get();
    const newMutedState = !isMusicMuted;
    
    set({ isMusicMuted: newMutedState });
    
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else {
        // Ensure loop is maintained when resuming music
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
        backgroundMusic.play().catch(error => {
          console.log("Music play prevented:", error);
        });
      }
    }
    
    console.log(`Music ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },

  playClick: () => {
    const { clickSound, isMuted } = get();
    if (clickSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Click sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = clickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(error => {
        console.log("Click sound play prevented:", error);
      });
    }
  },

  playMusic: () => {
    const { backgroundMusic, isMusicMuted } = get();
    if (backgroundMusic && !isMusicMuted) {
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(error => {
        console.log("Music play prevented:", error);
      });
    }
  },

  stopMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }
}));
