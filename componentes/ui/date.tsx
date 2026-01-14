export default function DateComponent() {
  const date = new Date();
  const years = date.getFullYear();
  const mounth = date.toLocaleString("pt-BR", { month: "long" });
  const day = date.getDate();
  const days = date.toLocaleString("pt-BR", { weekday: "long" });
  return (
    <div>
      <p>
        {days} ,{day} {mounth} de {years}
      </p>
    </div>
  );
}
