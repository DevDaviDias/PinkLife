type ButtonProps = {
  icon?: React.ReactNode;
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  icon,
  label,
  children,
  onClick,
  className,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 transition flex items-center rounded-[0.5em] w-full ${className}`}
    >
      <span className="flex gap-3 text-[1.2em]">
        {icon}
        {children ?? label}
      </span>
    </button>
  );
}
