import { Effect } from "effect";

const hashString = (str: string): number => {
  return Effect.runSync(
    Effect.sync(() => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    }),
  );
};

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)] as T;
  }
}
export const generateAvatar = (publicKey: string): string => {
  return Effect.runSync(
    Effect.sync(() => {
      if (!publicKey.trim()) {
        return ""; // Return empty SVG if no key provided
      }

      const seed: number = hashString(publicKey);
      const rng = new SeededRandom(seed);

      // Cyberpunk color palettes
      const neonColors: string[] = [
        "#00ffff",
        "#ff0080",
        "#80ff00",
        "#ff8000",
        "#8000ff",
        "#ff0040",
        "#00ff80",
        "#4080ff",
        "#ff4080",
        "#80ff40",
      ];

      const darkColors: string[] = [
        "#1a1a2e",
        "#16213e",
        "#0f3460",
        "#2d1b69",
        "#3c1874",
      ];

      // Generate avatar components
      const bgColor: string = rng.choice(darkColors);
      const primaryColor: string = rng.choice(neonColors);
      const secondaryColor: string = rng.choice(
        neonColors.filter((c) => c !== primaryColor),
      );
      const accentColor: string = rng.choice(
        neonColors.filter((c) => c !== primaryColor && c !== secondaryColor),
      );

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 320 320">
        <defs>
          <linearGradient id="bg-gradient-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
          </linearGradient>
          <filter id="glow-${seed}">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="neon-${seed}">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>`;

      // Background
      svg += `<rect width="320" height="320" fill="url(#bg-gradient-${seed})" opacity="0.5" filter="url(#bg-gradient-${seed})" />`;

      // hash pattern background
      for (let i = 0; i < 20; i++) {
        const x = rng.range(10, 80);
        const y = rng.range(10, 80);
        const width = rng.range(20, 60);
        const opacity = rng.next() * 0.3 + 0.1;

        svg += `<rect x="${x}" y="${y}" width="${width}" height="2" fill="${primaryColor}" opacity="${opacity}"/>`;
        svg += `<rect x="${x}" y="${y}" width="2" height="${width}" fill="${primaryColor}" opacity="${opacity}"/>`;
      }

      // Main face structure
      const faceType = rng.range(1, 3);

      if (faceType === 1) {
        // Hexagonal face
        svg += `<polygon points="150,50 200,100 200,200 150,250 100,200 100,100"
                fill="none" stroke="${primaryColor}" stroke-width="3" filter="url(#neon-${seed})"/>`;
      } else if (faceType === 2) {
        // Diamond face
        svg += `<polygon points="150,60 220,150 150,240 80,150"
                fill="none" stroke="${primaryColor}" stroke-width="3" filter="url(#neon-${seed})"/>`;
      } else {
        // Circular face with tech details
        svg += `<circle cx="160" cy="160" r="60"
                fill="none" stroke="${primaryColor}" stroke-width="3" filter="url(#neon-${seed})"/>`;
      }

      // // Eyes
      // const eyeType = rng.range(1, 4);

      // if (eyeType === 1) {
      //   // Glowing dots
      //   svg += `<circle cx="120" cy="120" r="8" fill="${secondaryColor}" filter="url(#glow-${seed})"/>`;
      //   svg += `<circle cx="180" cy="120" r="8" fill="${secondaryColor}" filter="url(#glow-${seed})"/>`;
      // } else if (eyeType === 2) {
      //   // Rectangular cybernetic eyes
      //   svg += `<rect x="110" y="110" width="20" height="12" fill="${secondaryColor}" filter="url(#glow-${seed})"/>`;
      //   svg += `<rect x="170" y="110" width="20" height="12" fill="${secondaryColor}" filter="url(#glow-${seed})"/>`;
      //   svg += `<rect x="112" y="112" width="16" height="8" fill="${accentColor}"/>`;
      //   svg += `<rect x="172" y="112" width="16" height="8" fill="${accentColor}"/>`;
      // } else {
      //   // Line eyes
      //   svg += `<line x1="110" y1="120" x2="130" y2="120" stroke="${secondaryColor}" stroke-width="4" filter="url(#glow-${seed})"/>`;
      //   svg += `<line x1="170" y1="120" x2="190" y2="120" stroke="${secondaryColor}" stroke-width="4" filter="url(#glow-${seed})"/>`;
      // }

      // Mouth/interface
      const mouthType = rng.range(0, 1);

      if (mouthType === 4) {
        // Digital mouth
        svg += `<rect x="140" y="180" width="20" height="4" fill="${accentColor}" filter="url(#glow-${seed})"/>`;
        svg += `<rect x="135" y="185" width="30" height="2" fill="${accentColor}" opacity="0.6"/>`;
      } else {
        // Curved interface
        svg += `<path d="M 130 180 Q 150 190 170 180" stroke="${accentColor}" stroke-width="3" fill="none" filter="url(#glow-${seed})"/>`;
      }

      // Additional tech elements
      const numElements = rng.range(5, 15);
      for (let i = 0; i < numElements; i++) {
        const elementType = rng.range(1, 4);
        // const x = rng.range(50, 40);
        // const y = rng.range(50, 200);

        if (elementType === 1) {
          // Small circuits
          // svg += `<circle cx="${x}" cy="${y * 3}" r="3" fill="${rng.choice(neonColors)}" opacity="0.7"/>`;
          // svg += `<line x1="${x - 10}" y1="${y}" x2="${x + 10}" y2="${y}" stroke="${rng.choice(neonColors)}" stroke-width="1" opacity="0.5"/>`;
        } else if (elementType === 2) {
          // Data nodes
          // svg += `<rect x="${x - 5}" y="${y - 5}" width="10" height=${12} fill="none" stroke="${rng.choice(neonColors)}" stroke-width="0.5" opacity="0.6"/>`;
          // svg += `<circle cx="${x}" cy="${y}" r="2" fill="${rng.choice(neonColors)}" opacity="0.8"/>`;
        } else if (elementType === 3) {
          // Connection lines
          // const x2 = rng.range(50, 250);
          // const y2 = rng.range(50, 250);
          // svg += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${rng.choice(neonColors)}" stroke-width="0.33" opacity="0.3"/>`;
        } else {
          // svg +=
          //   `<path fill="white" className="size-3 fill-cyber-blue" stroke=${neonColors}s stroke-width="0.3" d="M235.62 129.7C214.4 174.93 196.1 196 178 196c-22.56 0-37.67-32.21-53.66-66.3C110.15 99.37 95.44 68 78 68c-14.2 0-31.13 20.76-50.34 61.7a4 4 0 0 1-7.24-3.4C41.6 81.07 59.9 60 78 60c22.56 0 37.67 32.21 53.66 66.3c14.19 30.33 28.9 61.7 46.34 61.7c14.2 0 31.13-20.76 50.34-61.7a4 4 0 0 1 7.24 3.4Z"></path>`.repeat(
          //     y,
          //   );
        }
      }

      // Corner tech details
      // svg += `<polygon points="10,10 40,10 10,40" fill="${primaryColor}" opacity="0.3"/>`;
      // svg += `<polygon points="290,10 290,40 260,10" fill="${primaryColor}" opacity="0.3"/>`;
      // svg += `<polygon points="10,290 40,290 10,260" fill="${primaryColor}" opacity="0.3"/>`;
      // svg += `<polygon points="290,290 260,290 290,260" fill="${primaryColor}" opacity="0.3"/>`;

      svg += "</svg>";
      return svg;
    }),
  );
};

export const randomHash = () => {
  const randomKey = Math.random().toString(36).substring(2, 15);
  return randomKey;
};

interface DownloadAvatarProps {
  svg: string;
}
export const downloadAvatar = ({ svg }: DownloadAvatarProps) => {
  if (!svg) return;

  const svgBlob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "cyberpunk-avatar.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
};
