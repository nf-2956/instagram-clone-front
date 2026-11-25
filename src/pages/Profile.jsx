import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { reelsData } from '../constants/reelsData';

const formatCount = (value) =>
  value >= 1000 ? `${(value / 1000).toFixed(1).replace('.0', '')}K` : `${value}`;

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const reel = username ? reelsData.find((item) => item.username === username) : null;
  const displayName = reel?.username ?? username ?? 'Sizning profilingiz';
  const initial = displayName.charAt(0).toUpperCase();
  const avatar = reel?.avatar ?? ['#a78bfa', '#f472b6'];

  const userReels = username ? reelsData.filter((item) => item.username === username) : [];
  const totalLikes = userReels.reduce((sum, item) => sum + item.likes, 0);
  const totalSaves = userReels.reduce((sum, item) => sum + item.saves, 0);

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-2xl px-4 pb-10 pt-4 text-white">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Orqaga"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
        >
          <FiArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold">{displayName}</h1>
      </div>

      <div className="flex items-center gap-5">
        <span
          aria-hidden="true"
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white ring-2 ring-white/60"
          style={{ background: `linear-gradient(135deg, ${avatar[0]}, ${avatar[1]})` }}
        >
          {initial}
        </span>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-lg font-semibold">{userReels.length}</p>
            <p className="text-sm text-white/60">Reels</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{formatCount(totalLikes)}</p>
            <p className="text-sm text-white/60">Likes</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{formatCount(totalSaves)}</p>
            <p className="text-sm text-white/60">Saves</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-white/70">
          {reel ? `@${reel.username}` : 'Hali ma’lumot yo‘q'}
        </p>
        <button
          type="button"
          className="rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
        >
          Follow
        </button>
      </div>

      {reel && (
        <p className="mt-3 text-sm leading-snug text-white/80">
          {reel.caption}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-1.5">
        {userReels.map((item) => (
          <Link
            key={item.id}
            to="/reels"
            className="aspect-[9/14] rounded-lg transition hover:opacity-80"
            style={{ background: `linear-gradient(135deg, ${item.media[0]}, ${item.media[1]})` }}
            aria-label={`${item.username} reels`}
          />
        ))}
      </div>

      {username && userReels.length === 0 && (
        <p className="mt-6 text-center text-sm text-white/50">
          Bu foydalanuvchining hali reellari yo‘q.
        </p>
      )}
    </div>
  );
};

export default Profile;
