import { Content } from "./content";
import { RNGManager } from "use-rng/standalone";

export default async function Page() {
  const rng = new RNGManager();
  const rand = async () => await rng.roll(1, 100000, 0);

  const r1 = await rand();
  const r2 = await rand();
  const r3 = await rand();
  const r4 = await rand();

  const mappedSeq = { 2: r1, 3: r2, 5: r3, 8: r4 } as Record<number, number>;

  return (
    <div className="overflow-hidden h-screen flex flex-col w-screen">
      <div className="absolute w-full h-8 md:h-12 -mx-12 bg-gradient-to-r from-transparent via-sky-300/80 to-transparent rounded-full blur-2xl -rotate-12 top-[calc(12lvh)]" />
      <main className="py-12 md:py-6">
        <div className="relative overflow-hidden flex justify-center z-10 w-full max-w-7xl mx-auto">
          <Content mappedSeq={mappedSeq} />
        </div>
      </main>
    </div>
  );
}
