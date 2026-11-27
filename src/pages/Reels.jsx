import { useCallback, useEffect, useRef, useState } from 'react';
import { FiFilm, FiRefreshCw, FiUsers } from 'react-icons/fi';
import { getReels } from '../api/reels';
import ReelCard from '../components/reels/ReelCard';
import ReelsBottomNav from '../components/reels/ReelsBottomNav';
import ReelsTopBar from '../components/reels/ReelsTopBar';
import ReelUpload from '../components/reels/ReelUpload';

const PAGE_SIZE = 5;

const Message = ({ icon: Icon, title, text, action }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
    <Icon size={44} className="text-white/70" />
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="max-w-xs text-sm text-white/60">{text}</p>
    {action}
  </div>
);

const Reels = () => {
  const [tab, setTab] = useState('reels');
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const scrollRef = useRef(null);

  const load = useCallback(async (nextPage) => {
    setLoading(true);
    setError('');
    try {
      const data = await getReels(nextPage, PAGE_SIZE);
      setReels((current) => (nextPage === 1
        ? data.reels
        : [...current, ...data.reels.filter((reel) => !current.some((item) => item._id === reel._id))]));
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  // Load the next page when the user scrolls near the end
  const onScroll = (event) => {
    const el = event.currentTarget;
    if (hasMore && !loading && el.scrollTop + el.clientHeight * 2 >= el.scrollHeight) load(page + 1);
  };

  // Following an author updates every reel of that author
  const onFollowChange = (authorId, isFollowing) => {
    setReels((current) => current.map((reel) => (
      reel.author._id === authorId ? { ...reel, isFollowingAuthor: isFollowing } : reel
    )));
  };

  const visible = tab === 'friends' ? reels.filter((reel) => reel.isFollowingAuthor) : reels;

  let content;
  if (loading && reels.length === 0) {
    content = (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg" aria-label="Reels yuklanmoqda" />
      </div>
    );
  } else if (error && reels.length === 0) {
    content = (
      <Message
        icon={FiRefreshCw}
        title="Reels yuklanmadi"
        text={error}
        action={<button type="button" onClick={() => load(1)} className="btn btn-sm mt-1">Qayta urinish</button>}
      />
    );
  } else if (visible.length === 0) {
    content = tab === 'friends' ? (
      <Message icon={FiUsers} title="Do‘stlar reellari yo‘q" text="Kuzatayotgan odamlaringiz reel joylasa, shu yerda ko‘rinadi." />
    ) : (
      <Message
        icon={FiFilm}
        title="Hali reel yo‘q"
        text="Birinchi reelni siz joylang."
        action={<button type="button" onClick={() => setUploadOpen(true)} className="btn btn-sm mt-1">Reel joylash</button>}
      />
    );
  } else {
    content = visible.map((reel) => (
      <div key={reel._id} className="flex h-full snap-start snap-always justify-center">
        <ReelCard reel={reel} muted={muted} onToggleMute={() => setMuted((value) => !value)} onFollowChange={onFollowChange} />
      </div>
    ));
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <ReelsTopBar activeTab={tab} onTabChange={setTab} onCreate={() => setUploadOpen(true)} />

      <div key={tab} ref={scrollRef} onScroll={onScroll} className="h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain no-scrollbar">
        {content}
      </div>

      <ReelsBottomNav />
      <ReelUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onCreated={(reel) => {
          setUploadOpen(false);
          setTab('reels');
          setReels((current) => [reel, ...current]);
          // show the new reel right away
          requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
        }}
      />
    </div>
  );
};

export default Reels;
