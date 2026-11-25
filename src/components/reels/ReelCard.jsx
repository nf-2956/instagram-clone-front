import { useEffect, useRef, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import ReelActions from './ReelActions';
import ReelInfo from './ReelInfo';

const BURST_DURATION = 950;

const ReelCard = ({ reel }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const burstTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(burstTimer.current), []);

  const handleDoubleTap = () => {
    setLiked(true);
    setBurstId((current) => current + 1);
    window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setBurstId(0), BURST_DURATION);
  };

  const likeCount = reel.likes + (liked ? 1 : 0);
  const saveCount = reel.saves + (saved ? 1 : 0);

  return (
    <article className="relative h-full w-full max-w-[450px] shrink-0 overflow-hidden bg-neutral-900">
      <div
        className="absolute inset-0 touch-manipulation select-none"
        onDoubleClick={handleDoubleTap}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="reel-media absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]"
            style={{
              background: `linear-gradient(135deg, ${reel.media[0]} 0%, ${reel.media[1]} 100%)`,
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {burstId > 0 && (
          <div
            key={burstId}
            aria-hidden="true"
            className="reel-burst pointer-events-none absolute left-1/2 top-1/2 z-20"
          >
            <FiHeart size={110} fill="currentColor" className="text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]" />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 px-4 pb-20 md:pb-6">
        <ReelInfo
          reel={reel}
          following={following}
          onToggleFollow={() => setFollowing((value) => !value)}
        />
        <ReelActions
          reel={{ ...reel, likes: likeCount, saves: saveCount }}
          liked={liked}
          saved={saved}
          onToggleLike={() => setLiked((value) => !value)}
          onToggleSave={() => setSaved((value) => !value)}
        />
      </div>
    </article>
  );
};

export default ReelCard;
