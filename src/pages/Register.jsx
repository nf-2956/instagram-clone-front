import { useState } from 'react';
import { FiEye, FiEyeOff, FiInfo, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthField from '../components/AuthField';
import { registerSuccess } from '../store/authSlice';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerSuccess({ user: { username: form.username, email: form.email }, token: 'demo-token' }));
    toast.success('Hisob yaratildi');
    navigate('/', { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hisob yaratish</h1>
        <p className="mt-2 text-sm text-base-content/70">Bir daqiqada ro'yxatdan o'ting.</p>
      </div>

      <div className="flex flex-col gap-4">
        <AuthField
          id="username"
          label="Foydalanuvchi nomi"
          icon={FiUser}
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="foydalanuvchi"
          autoComplete="username"
          required
        />

        <AuthField
          id="email"
          label="Email"
          icon={FiMail}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@example.com"
          autoComplete="email"
          required
        />

        <AuthField
          id="password"
          label="Parol"
          icon={FiLock}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Kamida 6 ta belgi"
          autoComplete="new-password"
          minLength={6}
          required
          trailing={
            <button
              className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 text-base-content/50"
              type="button"
              aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko rsatish'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
        />
      </div>

      <button className="btn btn-primary w-full transition-transform active:scale-[0.99]" type="submit">
        Ro'yxatdan o'tish
      </button>

      <p className="text-center text-sm text-base-content/70">
        Hisobingiz bormi?{' '}
        <Link className="link link-primary font-semibold no-underline hover:underline" to="/login">
          Kirish
        </Link>
      </p>

      <div className="alert alert-info text-sm">
        <FiInfo size={18} />
        <span>Demo rejim: hisob brauzerda saqlanadi.</span>
      </div>
    </form>
  );
};

export default Register;
