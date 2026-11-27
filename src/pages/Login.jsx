import { useState } from 'react';
import { FiAlertCircle, FiArrowRight, FiLock, FiMail, FiLogIn } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginRequest } from '../api/auth';
import AuthField from '../components/AuthField';
import PasswordToggle from '../components/PasswordToggle';
import { loginSuccess } from '../store/authSlice';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest({ email: form.email.trim(), password: form.password });
      dispatch(loginSuccess({ user: data.user, token: data.token || null }));
      toast.success(`Xush kelibsiz, ${data.user.username}`);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ig-purple via-ig-red to-ig-orange text-white">
          <FiLogIn size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xush kelibsiz</h1>
          <p className="text-sm text-base-content/70">Davom etish uchun kiring.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          required
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
        />

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-error/10 px-3 py-2.5 text-sm text-error">
            <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn mt-2 w-full border-0 bg-gradient-to-r from-ig-purple to-ig-red text-white hover:opacity-90"
        >
          {loading && <span className="loading loading-spinner loading-sm" />}
          Kirish
          {!loading && <FiArrowRight size={18} />}
        </button>
      </form>

      <div className="divider my-6 text-xs text-base-content/50">yoki</div>
      <p className="text-center text-sm text-base-content/70">
        Hisobingiz yo'qmi?{' '}
        <Link to="/register" className="link link-primary font-semibold no-underline hover:underline">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  );
};

export default Login;
