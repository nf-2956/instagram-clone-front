import { useState } from 'react';
import { FiAlertCircle, FiArrowRight, FiLock, FiMail, FiUserPlus, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerRequest } from '../api/auth';
import AuthField from '../components/AuthField';
import PasswordToggle from '../components/PasswordToggle';
import { registerSuccess } from '../store/authSlice';

// Client-side checks before sending to the backend
const validate = ({ username, password }) => {
  const errors = {};
  if (!/^[a-z0-9._]{3,30}$/.test(username)) {
    errors.username = '3-30 ta belgi: kichik harf, raqam, nuqta yoki _';
  }
  if (password.length < 6) {
    errors.password = "Parol kamida 6 ta belgi bo'lsin";
  }
  return errors;
};

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: name === 'username' ? value.toLowerCase() : value });
    setErrors({ ...errors, [name]: '' });
    setServerError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, username: form.username.trim(), email: form.email.trim() };
    const nextErrors = validate(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const data = await registerRequest(payload);
      dispatch(registerSuccess({ user: data.user, token: data.token || null }));
      toast.success('Hisob yaratildi');
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ig-purple via-ig-red to-ig-orange text-white">
          <FiUserPlus size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hisob ochish</h1>
          <p className="text-sm text-base-content/70">Bir daqiqada ro'yxatdan o'ting.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <AuthField
          id="username"
          icon={FiUser}
          label="Foydalanuvchi nomi"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="ali.valiyev"
          hint="Kichik harf, raqam, nuqta yoki _"
          autoComplete="username"
          error={errors.username}
          required
        />
        <AuthField
          id="email"
          icon={FiMail}
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="ali@mail.uz"
          autoComplete="email"
          required
        />
        <AuthField
          id="password"
          icon={FiLock}
          label="Parol"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={form.password}
          onChange={handleChange}
          hint="Kamida 6 ta belgi"
          autoComplete="new-password"
          error={errors.password}
          required
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
        />

        {serverError && (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-error/10 px-3 py-2.5 text-sm text-error">
            <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn mt-2 w-full border-0 bg-gradient-to-r from-ig-purple to-ig-red text-white hover:opacity-90"
        >
          {loading && <span className="loading loading-spinner loading-sm" />}
          Hisob ochish
          {!loading && <FiArrowRight size={18} />}
        </button>
      </form>

      <div className="divider my-6 text-xs text-base-content/50">yoki</div>
      <p className="text-center text-sm text-base-content/70">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="link link-primary font-semibold no-underline hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  );
};

export default Register;
