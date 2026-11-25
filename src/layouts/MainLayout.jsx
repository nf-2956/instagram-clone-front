import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isReels = pathname === '/reels';

  return (
    <div className={`min-h-screen text-base-content ${isReels ? 'bg-black' : 'bg-base-100'}`}>
      <div className="mx-auto flex max-w-5xl">
        <Sidebar />
        <main className={`min-w-0 flex-1 ${isReels ? '' : 'pb-20 md:pb-0'}`}>
          <Outlet />
        </main>
      </div>
      {!isReels && <BottomNav />}
    </div>
  );
};

export default MainLayout;
