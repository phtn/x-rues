// import { useEffect, useState, useCallback } from "react";

// // Seeded random number generator
// class SeededRandom {
//   private seed: number;

//   constructor(seed: number) {
//     this.seed = seed;
//   }

//   next() {
//     this.seed = (this.seed * 9301 + 49297) % 233280;
//     return this.seed / 233280;
//   }

//   range(min: number, max: number) {
//     return Math.floor(this.next() * (max - min + 1)) + min;
//   }

//   choice<T>(array: T[]): T {
//     return array[Math.floor(this.next() * array.length)];
//   }
// }

// interface AvatarGeneratorProps {
//   initialPublicKey?: string;
//   size?: number;
//   className?: string;
// }

// export const AvatarGenerator = ({
//   initialPublicKey = "default-key",
//   size = 300,
//   className = "",
// }: AvatarGeneratorProps) => {
//   const [publicKey, setPublicKey] = useState<string>(initialPublicKey);
//   const [svgContent, setSvgContent] = useState<string>("");

//   // Generate avatar SVG when publicKey changes
//   useEffect(() => {
//     const svg = generateAvatarSvg(publicKey);
//     setSvgContent(svg);
//   }, [publicKey]);

//   // Handle input change
//   const handleKeyChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setPublicKey(e.target.value);
//     },
//     [],
//   );

//   // Generate random key
//   const generateRandomKey = useCallback(() => {
//     const randomKey = Math.random().toString(36).substring(2, 15);
//     setPublicKey(randomKey);
//   }, []);

//   return (
//     <div className={`avatar-generator ${className}`}>
//       <div className="mb-4">
//         <label htmlFor="publicKey" className="block text-sm font-medium mb-1">
//           Public Key or Identifier:
//         </label>
//         <input
//           id="publicKey"
//           type="text"
//           value={publicKey}
//           onChange={handleKeyChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           placeholder="Enter a public key or unique identifier"
//         />
//       </div>

//       <div className="flex space-x-2 mb-4">
//         <button
//           onClick={() => setPublicKey(publicKey)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Generate Avatar
//         </button>
//         <button
//           onClick={generateRandomKey}
//           className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//         >
//           Random
//         </button>
//         <button
//           onClick={downloadAvatar}
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           Download
//         </button>
//       </div>

//       <div
//         className="avatar-preview border border-gray-300 rounded-md p-2"
//         style={{ width: size, height: size }}
//         dangerouslySetInnerHTML={{ __html: svgContent }}
//       />
//     </div>
//   );
// };

// // Simple hook to use the avatar generator functionality
// export const useAvatarGenerator = (initialKey: string = "") => {
//   const [key, setKey] = useState<string>(initialKey);
//   const [avatarSvg, setAvatarSvg] = useState<string>("");

//   useEffect(() => {
//     setAvatarSvg(generateAvatarSvg(key));
//   }, [key]);

//   return {
//     avatarSvg,
//     setKey,
//     regenerate: () => setAvatarSvg(generateAvatarSvg(key)),
//     downloadAvatar: () => {
//       if (!avatarSvg) return;

//       const svgBlob = new Blob([avatarSvg], {
//         type: "image/svg+xml;charset=utf-8",
//       });
//       const svgUrl = URL.createObjectURL(svgBlob);

//       const downloadLink = document.createElement("a");
//       downloadLink.href = svgUrl;
//       downloadLink.download = "cyberpunk-avatar.svg";
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//       URL.revokeObjectURL(svgUrl);
//     },
//   };
// };

// // Simple avatar component that just displays the avatar
// interface AvatarProps {
//   publicKey: string;
//   size?: number;
//   className?: string;
// }

// export const Avatar: React.FC<AvatarProps> = ({
//   publicKey,
//   size = 100,
//   className = "",
// }) => {
//   const [svgContent, setSvgContent] = useState<string>("");

//   useEffect(() => {
//     setSvgContent(generateAvatarSvg(publicKey));
//   }, [publicKey]);

//   return (
//     <div
//       className={`avatar ${className}`}
//       style={{ width: size, height: size }}
//       dangerouslySetInnerHTML={{ __html: svgContent }}
//     />
//   );
// };

// export default AvatarGenerator;
