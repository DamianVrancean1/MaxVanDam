import '../../styles/Input.css';

interface InputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<any>;
  error?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error,
  placeholder,
  required = false,
  multiline = false
}: InputProps) => {
  return (
    <div className="input-group">
      <label htmlFor={name} className="input-label">
        {label} {required && <span className="required">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${error ? 'input-error' : ''}`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${error ? 'input-error' : ''}`}
        />
      )}
      
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
