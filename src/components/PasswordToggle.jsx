import { FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordToggle = ({ visible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={visible ? 'Parolni yashirish' : "Parolni ko'rsatish"}
    className="btn btn-ghost btn-circle btn-xs -mr-1 text-base-content/60"
  >
    {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
  </button>
);

export default PasswordToggle;
