import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiHeart, FiInstagram, FiRefreshCw } from 'react-icons/fi';
import { api, imageUrl } from '../api/client';
import PostCard from '../components/home/PostCard';
import StoriesBar from '../components/home/StoriesBar';

const PAGE_SIZE = 10;
const demoUsers = [
  { _id: 'demo-user-1', username: 'aziza.lens', fullName: 'Aziza Karimova', avatar: 'https://i.pravatar.cc/150?img=47' },
  { _id: 'demo-user-2', username: 'sardor.travels', fullName: 'Sardor Aliyev', avatar: 'https://i.pravatar.cc/150?img=12' },
];
const demoPosts = [
  { _id: 'demo-post-1', author: demoUsers[0], image: 'https://picsum.photos/seed/uzbekistan-morning/900/1100', caption: 'Kichik lahzalarda katta go‘zallik bor ✨', likesCount: 248, commentsCount: 1, isLiked: false, createdAt: new Date(Date.now() - 3600000).toISOString(), demo: true },
  { _id: 'demo-post-2', author: demoUsers[1], image: 'https://picsum.photos/seed/travel-mountains/900/1100', caption: 'Yangi manzillar, yangi taassurotlar 🏔️', likesCount: 132, commentsCount: 0, isLiked: false, createdAt: new Date(Date.now() - 10800000).toISOString(), demo: true },
];
const demoGroups = demoUsers.map((user, index) => ({
  user,
  allViewed: false,
  stories: [{ _id: `demo-story-${index}`, image: demoPosts[index].image, viewed: false, type: 'image', demo: true }],
}));

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [feedLoading, setFeedLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [storiesError, setStoriesError] = useState('');

  const loadFeed = useCallback(async (nextPage = 1) => {
    if (nextPage === 1) setFeedLoading(true);
    else setMoreLoading(true);
    setFeedError('');
    try {
      const data = await api.get(`/posts?page=${nextPage}&limit=${PAGE_SIZE}`);
      setPosts((current) => nextPage === 1
        ? data.posts
        : [...current, ...data.posts.filter((post) => !current.some((item) => item._id === post._id))]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (error) {
      setFeedError(error.message);
    } finally {
      setFeedLoading(false);
      setMoreLoading(false);
    }
  }, []);

  const loadStories = useCallback(async () => {
    setStoriesError('');
    try {
      const data = await api.get('/stories');
      setGroups(data.groups);
    } catch (error) {
      setStoriesError(error.message);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    loadStories();
  }, [loadFeed, loadStories]);

  const username = user?.username || 'siz';
  const visiblePosts = [...posts, ...demoPosts];
  const visibleGroups = useMemo(() => [...groups, ...demoGroups], [groups]);

  return (
    <div data-page="home" className="mx-auto flex w-full max-w-[920px] justify-center gap-8 md:px-6 lg:gap-12">
      <section className="min-w-0 w-full max-w-[500px]">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-base-300 bg-base-100/95 px-4 backdrop-blur md:hidden">
          <Link to="/" className="font-logo text-[32px] leading-none">Instagram</Link>
          <Link to="/notifications" className="rounded-full p-2" aria-label="Bildirishnomalar"><FiHeart size={25} /></Link>
        </div>

        <StoriesBar groups={visibleGroups} currentUser={user} onChange={loadStories} />
        {storiesError && (
          <div role="alert" className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-lg bg-error/10 p-3 text-sm text-error">
            <span>Istoriyalar yuklanmadi: {storiesError}</span>
            <button type="button" onClick={loadStories} className="btn btn-ghost btn-xs">Qayta</button>
          </div>
        )}

        {feedLoading ? (
          <div className="space-y-5 px-4" aria-label="Postlar yuklanmoqda">
            {[1, 2].map((item) => <div key={item} className="space-y-3"><div className="skeleton h-10 w-40" /><div className="skeleton aspect-square w-full" /><div className="skeleton h-4 w-48" /></div>)}
          </div>
        ) : feedError && visiblePosts.length === 0 ? (
          <div role="alert" className="mx-4 rounded-xl border border-base-300 p-8 text-center">
            <p className="mb-4 text-sm">Postlar yuklanmadi: {feedError}</p>
            <button type="button" onClick={() => loadFeed()} className="btn btn-primary btn-sm gap-2"><FiRefreshCw /> Qayta urinish</button>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="mx-4 mt-4 border-t border-base-300 px-4 py-16 text-center">
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-base-content"><FiInstagram size={32} /></span>
            <h1 className="text-2xl font-bold">Lentangiz hozircha bo‘sh</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm text-base-content/60">Yangi insonlarni toping va ularning ulashgan lahzalarini shu yerda kuzating.</p>
            <Link to="/search" className="btn btn-primary btn-sm mt-5">Odamlarni qidirish</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-6 sm:gap-6">
            {visiblePosts.map((post) => <PostCard key={post._id} post={post} onRepost={loadStories} onDelete={(id) => setPosts((current) => current.filter((item) => item._id !== id))} />)}
          </div>
        )}

        {feedError && <div role="alert" className="px-4 py-3 text-center text-sm text-error">Haqiqiy postlar yuklanmadi: {feedError} <button type="button" onClick={() => loadFeed()} className="font-semibold underline">Qayta urinish</button></div>}
        {hasMore && !feedLoading && (
          <div className="px-4 py-6 text-center">
            <button type="button" onClick={() => loadFeed(page + 1)} disabled={moreLoading} className="btn btn-outline btn-sm">
              {moreLoading && <span className="loading loading-spinner loading-xs" />} Yana yuklash
            </button>
          </div>
        )}
      </section>

      <aside className="hidden w-64 shrink-0 pt-10 lg:block">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/profile">
            {user?.avatar ? <img src={imageUrl(user.avatar)} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-base-300 font-semibold uppercase">{username[0]}</span>}
          </Link>
          <Link to="/profile" className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{username}</span><span className="block truncate text-sm text-base-content/50">{user?.fullName || 'Mening profilim'}</span></Link>
          <Link to="/profile" className="text-xs font-semibold text-info">Profil</Link>
        </div>
        <div className="mt-5 border-t border-base-300 pt-4">
          <p className="text-sm font-semibold">Lahzalaringizni ulashing</p>
          <p className="mt-1 text-xs leading-5 text-base-content/60">Yaqinlaringiz bilan yangi surat va hikoyalaringizni baham ko‘ring.</p>
          <Link to="/post" className="btn btn-primary btn-sm mt-4 w-full">Post yaratish</Link>
        </div>
        </div>
        <p className="mt-6 px-1 text-xs text-base-content/40">Instagram · Sizning lahzalaringiz</p>
      </aside>
    </div>
  );
};

export default Home;
