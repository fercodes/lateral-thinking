import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

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
      className={`${dmSans.className} uppercase font-medium tracking-[0.15em] cursor-pointer transition-colors duration-300 ${className}`}
      style={{
        fontSize: '0.7rem',
        padding: '14px 32px',
        background: 'transparent',
        color: '#EDE0C4',
        border: '1.5px solid #EDE0C4',
        borderRadius: 4,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#EDE0C4';
        e.currentTarget.style.color = '#1B3FAB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#EDE0C4';
      }}
    >
      {children}
    </button>
  );
}
