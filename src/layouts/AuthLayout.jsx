import { FiClock, FiHeart, FiImage, FiInstagram, FiSearch } from 'react-icons/fi';
import { NavLink, Outlet } from 'react-router-dom';

const features = [
  { icon: FiImage, text: 'Rasm joylang va izohlar oling' },
  { icon: FiClock, text: "24 soatlik istoriya qo'ying" },
  { icon: FiHeart, text: 'Like bosing, fikr qoldiring' },
  { icon: FiSearch, text: "Do'stlaringizni toping" },
];

// Neutral active tab (like a segmented control) so only the submit button carries the gradient
const tabClass = ({ isActive }) =>
  `tab h-10 rounded-lg font-semibold transition-colors ${
    isActive ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/60 hover:text-base-content'
  }`;

const AuthLayout = () => (
  <div className="grid min-h-[100dvh] bg-base-100 text-base-content lg:grid-cols-2">
    {/* Left: brand panel (desktop only) */}
    <section className="relative hidden flex-col bg-gradient-to-br from-ig-purple via-ig-red to-ig-orange p-12 text-white lg:flex">
      <span className="flex items-center gap-2 text-xl font-semibold">
        <FiInstagram size={26} />
        Instagram
      </span>

      <div className="my-auto max-w-md">
        <h2 className="text-5xl font-bold leading-tight tracking-tight">Do'stlaringiz bilan bog'laning.</h2>

        <ul className="mt-10 flex flex-col gap-5">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-4 text-lg font-medium">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
                <Icon size={20} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-white/80">Mars IT nF-2956 o'quv loyihasi</p>

      {/* Wavy edge: painted in the page background colour, so it follows light / dark theme */}
      <svg
        className="absolute inset-y-0 -right-px h-full w-24 text-base-100"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M100 0 H70 C20 120 95 240 55 380 C15 520 90 640 50 780 C25 870 60 940 75 1000 H100 Z"
        />
      </svg>
    </section>

    {/* Right: tabs + form */}
    <section className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 text-xl font-semibold lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-ig-purple via-ig-red to-ig-orange text-white">
            <FiInstagram size={20} />
          </span>
          Instagram
        </div>

        <div role="tablist" className="tabs-boxed tabs mb-8 grid grid-cols-2 p-1">
          <NavLink to="/login" role="tab" className={tabClass}>
            Kirish
          </NavLink>
          <NavLink to="/register" role="tab" className={tabClass}>
            Ro'yxatdan o'tish
          </NavLink>
        </div>

        <Outlet />
      </div>
    </section>
  </div>
);

export default AuthLayout;
