import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Mascote vetorial provisório: substituir por personagem aprovado, sem publicar fotos particulares. */
export default function Salem() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cat = ref.current;
    if (!cat || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const track = { progress: 0 };
    const trigger = ScrollTrigger.create({
      trigger: '#journey',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        track.progress = self.progress;
        const p = track.progress;
        // Saltos estilizados entre prateleiras ao longo da parede.
        const step = p * 6;
        const bounce = Math.sin((step % 1) * Math.PI);
        gsap.set(cat, {
          x: Math.sin(p * Math.PI * 5) * 25,
          y: Math.sin(p * Math.PI * 3) * 33 - bounce * 22,
          rotate: Math.sin(p * Math.PI * 6) * 4,
        });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="floating-salem" aria-hidden="true">
      <svg viewBox="0 0 180 210" role="img" focusable="false">
        <defs>
          <linearGradient id="fur" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#42433e" />
            <stop offset="1" stopColor="#141714" />
          </linearGradient>
          <radialGradient id="eye">
            <stop offset="0" stopColor="#fbe084" />
            <stop offset="1" stopColor="#d1a44a" />
          </radialGradient>
        </defs>
        <path d="M132 141 C186 135 174 195 142 181" fill="none" stroke="#242823" strokeWidth="15" strokeLinecap="round" />
        <ellipse cx="90" cy="146" rx="58" ry="51" fill="url(#fur)" />
        <path d="M44 74 L42 13 L76 44 Q89 36 103 44 L138 13 L138 75" fill="url(#fur)" />
        <path d="M52 55 L50 28 L71 48 Z M109 48 L129 28 L127 55 Z" fill="#805b58" opacity=".7" />
        <ellipse cx="90" cy="85" rx="60" ry="56" fill="url(#fur)" />
        <ellipse cx="69" cy="86" rx="14" ry="18" fill="url(#eye)" />
        <ellipse cx="111" cy="86" rx="14" ry="18" fill="url(#eye)" />
        <ellipse cx="71" cy="87" rx="4" ry="12" fill="#181a17" />
        <ellipse cx="109" cy="87" rx="4" ry="12" fill="#181a17" />
        <path d="M85 112 Q90 106 95 112 L90 117 Z" fill="#d69c95" />
        <path d="M90 117 Q83 125 79 119 M90 117 Q97 125 101 119" fill="none" stroke="#a6a69a" strokeWidth="2" strokeLinecap="round" />
        <g stroke="#bdb9ac" strokeWidth="1.5" opacity=".65">
          <path d="M79 115 L35 109 M79 119 L35 123 M101 115 L145 109 M101 119 L145 123" />
        </g>
        <ellipse cx="61" cy="183" rx="18" ry="12" fill="#21251f" />
        <ellipse cx="119" cy="183" rx="18" ry="12" fill="#21251f" />
      </svg>
    </div>
  );
}
