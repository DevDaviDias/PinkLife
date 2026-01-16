type Props = {
    children?: React.ReactNode;
  }

export default function ContentWrappers({ children }: Props) {
  return (
    <div className=" ml-[2em] mr-[3em] ">
      {children}
    </div>
  );
}