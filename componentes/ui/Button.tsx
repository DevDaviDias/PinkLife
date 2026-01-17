type ButtonProps = {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
};

export default function Button({
  icon,
  label,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 transition flex items-center rounded-[0.5em] w-full ${className}`}
    >
      <span className="flex gap-3 text-[1.2em]">
        {icon}
        {label}
      </span>
    </button>
  );
}
