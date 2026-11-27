// Label above the input, icon on the left, optional hint, error text below.
// `trailing` is an optional element inside the input on the right (e.g. show / hide password).
const AuthField = ({ id, label, icon: Icon, hint, trailing, error, ...inputProps }) => (
  <div className="form-control w-full">
    <label htmlFor={id} className="label pb-1.5 pt-0">
      <span className="label-text font-medium">{label}</span>
    </label>
    <div className={`input input-bordered flex items-center gap-3 ${error ? 'input-error' : 'focus-within:input-primary'}`}>
      {Icon && <Icon size={18} className="shrink-0 text-base-content/50" />}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="w-full min-w-0 grow"
        {...inputProps}
      />
      {trailing}
    </div>
    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-error">
        {error}
      </p>
    ) : (
      hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-base-content/60">
          {hint}
        </p>
      )
    )}
  </div>
);

export default AuthField;
