import { useState } from 'react';
import { FiMusic } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { imageUrl } from '../../api/client';

const CAPTION_LIMIT = 90;
const MARQUEE_LIMIT = 28;

const renderCaption = (caption, expanded) => {
  if (!expanded && caption.length > CAPTION_LIMIT) {
    return `${caption.slice(0, CAPTION_LIMIT)}…`;
  }
  return caption;
};

const ReelInfo = ({ reel, following, followBusy, onToggleFollow }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const { username, avatar } = reel.author;
  const caption = reel.caption || '';
  const audio = `${username} · Original audio`;
  const hasMore = caption.length > CAPTION_LIMIT;
  const animateAudio = audio.length > MARQUEE_LIMIT;

  const openProfile = () => navigate(`/profile/${encodeURIComponent(username)}`);

  return (
    <div className="min-w-0 flex-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={openProfile} aria-label={`${username} profilini ochish`} className="shrink-0">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white/20 text-sm font-bold text-white"
          >
            {avatar ? <img src={imageUrl(avatar)} alt="" className="h-full w-full object-cover" /> : username.charAt(0).toUpperCase()}
          </span>
        </button>
        <button
          type="button"
          onClick={openProfile}
          className="truncate text-[15px] font-semibold leading-none transition hover:underline"
        >
          {username}
        </button>
        {!reel.isMine && (
          <>
            <span className="text-white/40" aria-hidden="true">
              •
            </span>
            <button
              type="button"
              onClick={onToggleFollow}
              disabled={followBusy}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[13px] font-semibold transition disabled:opacity-60 ${
                following ? 'bg-white/15 text-white hover:bg-white/25' : 'text-info hover:text-white'
              }`}
            >
              {following ? 'Kuzatilmoqda' : 'Kuzatish'}
            </button>
          </>
        )}
      </div>

      {caption && (
        <p className={`mt-2.5 max-w-[320px] text-[14px] leading-[1.35] text-white ${expanded ? '' : 'line-clamp-2'}`}>
          <span className="font-semibold">{username}</span> {renderCaption(caption, expanded)}
        </p>
      )}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-0.5 text-[13px] text-white/60 transition hover:text-white"
        >
          {expanded ? 'Yashirish' : 'ko‘proq'}
        </button>
      )}

      <div className="mt-3 flex max-w-[250px] items-center gap-2 text-[12px] text-white">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-400"
        >
          <FiMusic size={11} className="text-white" />
        </span>
        <div className="min-w-0 overflow-hidden">
          {animateAudio ? (
            <div className="flex w-max reel-marquee">
              <span className="pr-8">{audio}</span>
              <span className="pr-8">{audio}</span>
            </div>
          ) : (
            <span className="block truncate">{audio}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReelInfo;
