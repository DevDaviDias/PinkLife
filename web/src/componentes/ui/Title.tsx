type propsTitle = {
  title: string;
};

export default function TitleSection({ title }: propsTitle) {
  return (
    <h2 className="text-2xl font-extrabold leading-tight text-pink-700 md:text-3xl">
      {title}
    </h2>
  );
}
