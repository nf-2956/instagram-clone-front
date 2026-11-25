import { useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ReelCard from '../components/reels/ReelCard';
import ReelsBottomNav from '../components/reels/ReelsBottomNav';
import ReelsTopBar from '../components/reels/ReelsTopBar';
import { reelsData } from '../constants/reelsData';

const Reels = () => {
  const [tab, setTab] = useState('reels');
  const navigate = useNavigate();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <ReelsTopBar activeTab={tab} onTabChange={setTab} onCreate={() => navigate('/post')} />

      <div
        key={tab}
        className="h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain no-scrollbar"
      >
        {tab === 'reels' ? (
          reelsData.map((reel) => (
            <div
              key={reel.id}
              className="flex h-full snap-start snap-always justify-center"
            >
              <ReelCard reel={reel} />
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <FiUsers size={44} className="text-white/70" />
            <h2 className="text-lg font-semibold">Friends</h2>
            <p className="max-w-xs text-sm text-white/60">
              Do‘stlaringizning reellari shu yerda ko‘rinadi. Ularni kuzatib boring.
            </p>
            <button
              type="button"
              onClick={() => setTab('reels')}
              className="mt-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
            >
              Reels’ga qaytish
            </button>
          </div>
        )}
      </div>

      <ReelsBottomNav />
    </div>
  );
};

export default Reels;
