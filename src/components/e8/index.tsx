import E8Lattice from "./e8";

export const TypingIndicator = () => (
  <div className="size-8 flex">
    <E8Lattice depth={50} theta={0.008} />
    <E8Lattice depth={40} theta={0.02} />
    <E8Lattice depth={60} theta={0.015} width={12} />
    {/* <E8Lattice depth={35} theta={0.03} /> */}
    <E8Lattice depth={20} theta={0.03} />
  </div>
);
