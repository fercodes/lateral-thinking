type SecondaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function SecondaryButton({
  children,
  onClick,
  className = '',
  type = 'button',
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mt-6 px-5 py-3
        md:mt-6 md:px-6 md:py-3
        border border-white/50 
        bg-white/5 
        text-white/80 
        rounded-3xl 
        backdrop-blur-sm 
        hover:bg-white/10 
        hover:text-white 
        transition 
        cursor-pointer
        ${className}`}
    >
      {children}
    </button>
  );
}
