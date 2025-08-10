import React from "react";

const FloatingInput = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  ...rest
}) => {
  return (
    <div className={`form-floating ${className}`}>
      <input
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default React.memo(FloatingInput);

{/* <div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div> */}