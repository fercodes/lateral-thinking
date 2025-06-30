type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function PrimaryButton({
  children,
  onClick,
  className = '',
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mt-6 px-5 py-3
        md:mt-6 md:px-6 md:py-3
        border-4 border-white 
        bg-white/10 
        text-white 
        rounded-3xl 
        backdrop-blur-md 
        hover:bg-white/20 
        transition 
        cursor-pointer
        ${className}`}
    >
      {children}
    </button>
  );
}
