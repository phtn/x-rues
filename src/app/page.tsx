import { Content } from "./content";

export default async function Page() {
  return (
    <div className="md:h-screen h-fit bg-radial-[at_10%_80%] dark:bg-gradient-to-b from-sky-100 to-cyan-200/10 dark:from-zinc-400 dark:via-zinc-300/60 dark:via-20% dark:to-zinc-600 dark:to-88% flex flex-col w-screen">
      <div className="h-16 w-full" />
      <div className="h-16 w-full border-y border-neutral-200" />
      <main className="relative h-[calc(80lvh)]">
        <div className="flex justify-center z-10 w-full max-w-7xl mx-auto">
          <Content />
        </div>
      </main>
      <div className="h-32 w-full  border-y border-neutral-200" />
    </div>
  );
}
