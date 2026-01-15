type Props = {
    children?: React.ReactNode;
  }

export default function ContentWrappers({ children }: Props) {
  return (
    <div className="m-2 ml-[17em]">
      {children}
    </div>
  );
}