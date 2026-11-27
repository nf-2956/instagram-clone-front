import { useEffect, useState } from 'react';
import { FiBookmark, FiGrid, FiHeart, FiRepeat, FiUsers, FiVideo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { imageUrl } from '../api/client';
import { getUserReels, videoUrl } from '../api/reels';

// reelType - which list GET /reels/user/:username?type=... returns
const sections = [
  { name: 'Postlar', empty: 'Hozircha postlar yo‘q.', Icon: FiGrid },
  { name: 'Videolar', empty: 'Hozircha videolar yo‘q.', Icon: FiVideo, reelType: 'own' },
  { name: 'Saqlanganlar', empty: 'Hozircha saqlangan videolar yo‘q.', Icon: FiBookmark, reelType: 'saved', onlyMe: true },
  { name: 'Repostlar', empty: 'Hozircha repost qilingan videolar yo‘q.', Icon: FiRepeat, reelType: 'reposts' },
  { name: 'Hamkorlik', empty: 'Hozircha hamkorlikdagi postlar yo‘q.', Icon: FiUsers },
];

export default function ProfileMedia({ posts = [], username, isMe = true }) {
  const visibleSections = sections.filter((section) => isMe || !section.onlyMe);
  const [selected, setSelected] = useState(0);
  const [reels, setReels] = useState({});
  const [error, setError] = useState('');
  const { name, empty, Icon, reelType } = visibleSections[selected];
  const list = reelType ? reels[reelType] : null;

  useEffect(() => {
    if (!reelType || !username || reels[reelType]) return undefined;
    let ignore = false;
    setError('');
    getUserReels(username, reelType)
      .then((data) => { if (!ignore) setReels((current) => ({ ...current, [reelType]: data.reels })); })
      .catch((err) => { if (!ignore) setError(err.message); });
    return () => { ignore = true; };
  }, [reelType, username, reels]);

  let content;
  if (selected === 0 && posts.length > 0) {
    content = (
      <ul className="profile-post-grid" aria-label="Postlar">
        {posts.map((post) => (
          <li key={post._id}>
            <img src={imageUrl(post.image)} alt={post.caption || 'Profil posti'} loading="lazy" />
          </li>
        ))}
      </ul>
    );
  } else if (reelType && error) {
    content = <p className="error" role="alert">{error}</p>;
  } else if (reelType && !list) {
    content = <div className="grid grid-cols-3 gap-1">{[0, 1, 2].map((key) => <div key={key} className="skeleton aspect-[9/16]" />)}</div>;
  } else if (list?.length > 0) {
    content = (
      <ul className="grid grid-cols-3 gap-1" aria-label={name}>
        {list.map((reel) => (
          <li key={reel._id} className="relative aspect-[9/16] overflow-hidden bg-black">
            <Link to="/reels" aria-label={`${reel.author.username} reeli`}>
              <video src={`${videoUrl(reel)}#t=0.5`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              <span className="absolute bottom-1 left-1 flex items-center gap-1 text-xs font-semibold text-white drop-shadow">
                <FiHeart aria-hidden="true" /> {reel.likesCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  } else {
    content = (
      <div className="profile-media-empty" aria-live="polite">
        <Icon aria-hidden="true" />
        <h2>{name}</h2>
        <p>{empty}</p>
      </div>
    );
  }

  return (
    <section className="profile-posts" aria-label="Profil kontenti">
      <div className="profile-media-nav" role="group" aria-label="Kontent bo‘limlari">
        {visibleSections.map(({ name: label, Icon: TabIcon }, index) => (
          <button type="button" key={label} title={label} aria-label={label}
            aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <TabIcon aria-hidden="true" />
          </button>
        ))}
      </div>
      {content}
    </section>
  );
}
