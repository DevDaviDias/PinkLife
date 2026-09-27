type Props = {
  children?: React.ReactNode;
};

export default function ContentWrappers({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bolinhas decorativas de fundo, iguais às da versão mobile */}
      <div
        className="pointer-events-none fixed -top-16 right-[-4rem] h-72 w-72 rounded-full bg-bubble-1 opacity-50 lg:right-[6rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-24 -left-10 h-44 w-44 rounded-full bg-bubble-2 opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed right-[-1.5rem] top-52 h-28 w-28 rounded-full bg-bubble-3 opacity-30 lg:right-[3rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-52 right-10 h-16 w-16 rounded-full bg-bubble-4 opacity-25 lg:right-[20rem]"
        aria-hidden
      />

      <div className="relative z-10 ml-[2em] mr-[3em]">{children}</div>
    </div>
  );
}
