import '../../styles/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false 
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
