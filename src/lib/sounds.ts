// 사운드 효과 관리 유틸리티
// Web Audio API를 사용하여 간단한 사운드 효과 생성

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const sounds = {
  flip: { frequency: 600, duration: 0.1, type: 'sine' as OscillatorType },
  match: { frequency: 800, duration: 0.3, type: 'sine' as OscillatorType },
  wrong: { frequency: 300, duration: 0.2, type: 'sawtooth' as OscillatorType },
  complete: { frequency: 1000, duration: 0.5, type: 'sine' as OscillatorType },
  hint: { frequency: 500, duration: 0.15, type: 'triangle' as OscillatorType },
  start: { frequency: 400, duration: 0.2, type: 'sine' as OscillatorType },
};

export const playSound = (soundType: keyof typeof sounds) => {
  if (!audioContext) return;
  
  try {
    const sound = sounds[soundType];
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = sound.type;
    oscillator.frequency.value = sound.frequency;
    
    // 볼륨 페이드 효과
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + sound.duration);
    
    // 특별 효과
    if (soundType === 'complete') {
      // 완료 사운드는 화음으로
      const oscillator2 = audioContext.createOscillator();
      oscillator2.connect(gainNode);
      oscillator2.type = 'sine';
      oscillator2.frequency.value = sound.frequency * 1.5;
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + sound.duration);
      
      const oscillator3 = audioContext.createOscillator();
      oscillator3.connect(gainNode);
      oscillator3.type = 'sine';
      oscillator3.frequency.value = sound.frequency * 2;
      oscillator3.start(audioContext.currentTime + 0.1);
      oscillator3.stop(audioContext.currentTime + sound.duration);
    }
    
    if (soundType === 'match') {
      // 매칭 사운드는 상승 효과
      oscillator.frequency.exponentialRampToValueAtTime(
        sound.frequency * 1.5,
        audioContext.currentTime + sound.duration
      );
    }
    
    if (soundType === 'wrong') {
      // 틀린 사운드는 하강 효과
      oscillator.frequency.exponentialRampToValueAtTime(
        sound.frequency * 0.5,
        audioContext.currentTime + sound.duration
      );
    }
  } catch (error) {
    console.log('Sound playback failed:', error);
  }
};

// 초기화 함수 (사용자 상호작용 후 호출)
export const initAudio = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

// 컴포넌트에서 사용 예시:
// import { playSound, initAudio } from '@/lib/sounds';
// 
// // 사용자 클릭 시 오디오 초기화
// onClick={() => {
//   initAudio();
//   playSound('flip');
// }}