import React, { useCallback, useEffect, useMemo, useRef } from "react";

// Define a vector in ℝ⁸ and ℝ²
type Vector8 = [number, number, number, number, number, number, number, number];
type Vector2 = [number, number];

interface E8LatticeProps {
  depth?: number;
  theta?: number;
  width?: number;
}
const E8Lattice = ({
  depth = 50,
  theta = 0.01,
  width = 10,
}: E8LatticeProps) => {
  const pathRef = useRef<SVGPathElement | null>(null);

  // Generates all 240 root vectors of E8 in ℝ⁸
  const generateE8Roots = (): Vector8[] => {
    const roots: Vector8[] = [];

    // Type 1: (±1, ±1, 0, ..., 0) with odd number of minus signs (but even product)
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        // const positions: [number, number] = [i, j];
        const signCombos: [number, number][] = [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ];

        for (const [s1, s2] of signCombos) {
          const vec: Vector8 = [0, 0, 0, 0, 0, 0, 0, 0];
          vec[i] = s1;
          vec[j] = s2;
          if ((s1 + s2) % 2 === 0) continue; // skip even combinations
          roots.push(vec);
        }
      }
    }

    // Type 2: (±½,...,±½) with even number of minuses and sum = 0
    const base: Vector8 = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

    for (let i = 0; i < 1 << 8; i++) {
      const vec: Vector8 = base.map((v, idx) =>
        i & (1 << idx) ? v : -v,
      ) as Vector8;

      const minusCount = vec.filter((x) => x < 0).length;
      const sum = vec.reduce((a, b) => a + b, 0);
      if (minusCount % 2 === 0 && Math.abs(sum) < 1e-6) {
        roots.push(vec);
      }
    }

    return roots;
  };

  // Orthogonal projection: simply use (x₁, x₂)
  // const projectTo2D = (v: Vector8): Vector2 => [v[0] * 50, v[1] * 50];
  // Replace the projection function with this
  const projectionMatrix3D = useMemo(
    () =>
      [
        [0.3535, 0.3535, 0.3535, 0.3535, -0.3535, -0.3535, -0.3535, -0.3535],
        [0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5],
        [0.25, 0.25, -0.25, -0.25, 0.25, 0.25, -0.25, -0.25],
      ] as number[][],
    [],
  );

  // useEffect(() => {
  //   const step = setInterval(() => {
  //     setOsc((prev) => !prev);
  //   }, 1000);
  //   return () => clearInterval(step);
  // }, []);

  const rotateX = useCallback(([x, y, z]: Vector3, theta: number): Vector3 => {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const yNew = y * cosT - z * sinT;
    const zNew = y * sinT + z * cosT;
    return [x, yNew, zNew];
  }, []);

  // Project 8D vector to 3D space
  type Vector3 = [number, number, number];

  const projectTo3D = useCallback(
    (v: Vector8): Vector3 => {
      const x = projectionMatrix3D[0]!.reduce(
        (sum, coeff, i) => sum + coeff * v[i]!,
        0,
      );
      const y = projectionMatrix3D[1]!.reduce(
        (sum, coeff, i) => sum + coeff * v[i]!,
        0,
      );
      const z = projectionMatrix3D[2]!.reduce(
        (sum, coeff, i) => sum + coeff * v[i]!,
        0,
      );
      return [x * width, y * 8, z * depth];
    },
    [projectionMatrix3D, depth, width],
  );

  const projectTo2DFrom3D = useCallback(
    (v3: Vector3, theta: number): Vector2 => {
      const rotated = rotateX(v3, theta);
      const [x, y] = [rotated[0], rotated[1]]; // ignore Z for now or use depth cueing
      return [x, y];
    },
    [rotateX],
  );

  const dotRadius = (z: number): number => 2 * (1 - z / 10);

  useEffect(() => {
    let frameId: number;
    let angle = 0.05;

    const animate = () => {
      const roots = generateE8Roots();
      const pathData = roots
        .map((v) => {
          const v3 = projectTo3D(v);
          const [x, y] = projectTo2DFrom3D(v3, angle);
          return `M ${dotRadius(x)},${dotRadius(y)} m -1,0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0`;
        }) //                          1^1
        .join(" ");

      if (pathRef.current) {
        pathRef.current.setAttribute("d", pathData);
      }

      angle += theta;
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [projectTo2DFrom3D, projectTo3D, theta]);

  // Create path drawing tiny circles at each point
  // const rootsToPath = useCallback(
  //   (roots: Vector8[]): string => {
  //     return roots
  //       .map((v: Vector8) => {
  //         const [x, y] = projectTo2D(v);
  //         return `M ${x},${y} m -1,0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0`;
  //       })
  //       .join(" ");
  //   },
  //   [projectTo2D],
  // );

  // useEffect(() => {
  //   const roots = generateE8Roots();
  //   const pathData = rootsToPath(roots);
  //   if (pathRef.current) {
  //     pathRef.current.setAttribute("d", pathData);
  //   }
  // }, [rootsToPath]);

  return (
    <svg
      viewBox="-4 -4 12 12"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "100%",
      }}
      className="drop-shadow-[0_2px_5px_rgba(0,245,255,0.4)]"
    >
      {/* <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs> */}
      <path
        // filter="url(#glow)"
        ref={pathRef}
        // fill="none"
        fill="#02f0ff"
        strokeWidth="1"
      />
    </svg>
  );
};

export default E8Lattice;
