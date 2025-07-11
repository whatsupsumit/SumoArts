import PropTypes from "prop-types";

export default function FormInputCheckout({
  type = "text",
  placeholder,
  defaultValue,
  required = false,
  maxLength,
  className = "",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      maxLength={maxLength}
      className={`w-full p-3 bg-var(--bg) text-var(--text) border-2 border-var(--accent) font-mono focus:outline-none focus:border-var(--accent) ${className}`}
      style={{ fontFamily: 'var(--font-mono)' }}
    />
  );
}

FormInputCheckout.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string,
};
