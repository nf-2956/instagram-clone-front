import { useState } from 'react';
import { FiMusic } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CAPTION_LIMIT = 80;
const MARQUEE_LIMIT = 28;

const ReelInfo = ({ reel, following, onToggleFollow }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const initial = reel.username.charAt(0).toUpperCase();
  const hasMore = reel.caption.length > CAPTION_LIMIT;
  const animateAudio = reel.audio.length > MARQUEE_LIMIT;

  const openProfile = () => navigate(`/profile/${encodeURIComponent(reel.username)}`);

  return (
    <div className="min-w-0 flex-1 text-white">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={openProfile}
          aria-label={`${reel.username} profilini ochish`}
          className="shrink-0"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white/60"
            style={{ background: `linear-gradient(135deg, ${reel.avatar[0]}, ${reel.avatar[1]})` }}
          >
            {initial}
          </span>
        </button>
        <button
          type="button"
          onClick={openProfile}
          className="truncate text-sm font-semibold transition hover:underline"
        >
          {reel.username}
        </button>
        <button
          type="button"
          onClick={onToggleFollow}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            following
              ? 'bg-white/15 text-white hover:bg-white/25'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      <p className={`mt-2 text-sm leading-snug ${expanded ? '' : 'line-clamp-2'}`}>
        {reel.caption}
      </p>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-0.5 text-xs text-white/60 transition hover:text-white"
        >
          {expanded ? 'Yashirish' : 'Ko‘proq'}
        </button>
      )}

      <div className="mt-2 flex max-w-[240px] items-center gap-1.5 text-xs text-white/90">
        <FiMusic size={12} className="shrink-0" />
        <div className="min-w-0 overflow-hidden">
          {animateAudio ? (
            <div className="flex w-max reel-marquee">
              <span className="pr-8">{reel.audio}</span>
              <span className="pr-8">{reel.audio}</span>
            </div>
          ) : (
            <span className="block truncate">{reel.audio}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReelInfo;
