import { NavLink } from 'react-router-dom';
import { FiHome, FiSearch, FiSend, FiUser, FiVideo } from 'react-icons/fi';

const items = [
  { label: 'Home', to: '/', icon: FiHome },
  { label: 'Reels', to: '/reels', icon: FiVideo },
  { label: 'Direct', to: '/chat', icon: FiSend },
  { label: 'Search', to: '/search', icon: FiSearch },
  { label: 'Profile', to: '/profile', icon: FiUser },
];

const ReelsBottomNav = () => (
  <nav
    aria-label="Asosiy navigatsiya"
    className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-white/10 bg-black px-2 pb-[env(safe-area-inset-bottom)] pt-2.5 md:hidden"
  >
    {items.map(({ label, to, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        aria-label={label}
        className={({ isActive }) =>
          `transition active:scale-90 ${
            isActive ? 'text-white' : 'text-white/50 hover:text-white/85'
          }`
        }
      >
        {({ isActive }) => <Icon size={23} strokeWidth={isActive ? 2.4 : 1.8} />}
      </NavLink>
    ))}
  </nav>
);

export default ReelsBottomNav;
