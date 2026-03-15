import '../../styles/Button.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    disabled?: boolean;
    className?: string;
}

const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'primary',
                    disabled = false,
                    className = ''
                }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-${variant} ${className}`.trim()}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
