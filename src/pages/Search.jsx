import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, imageUrl } from '../api/client';

const Search = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [followChanges, setFollowChanges] = useState({});
  const term = query.trim().replace(/^@/, '').trim();

  useEffect(() => {
    setResult(null);
    if (!term) return;

    let active = true;
    const timer = setTimeout(async () => {
      try {
        const { users } = await api.get(`/user/search?q=${encodeURIComponent(term)}`);
        if (active) setResult({ term, users });
      } catch (err) {
        if (active) {
          setResult({ term, error: true });
          toast.error(err.message);
        }
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [term]);

  const toggleFollow = async (user) => {
    const id = user._id;
    const previous = followChanges[id] || user;
    if (previous.pending) return;
    const update = (value) => setFollowChanges((changes) => ({ ...changes, [id]: value }));
    update({
      pending: true,
      isFollowing: !previous.isFollowing,
      followersCount: previous.followersCount + (previous.isFollowing ? -1 : 1),
    });
    try {
      const saved = await api.post(`/user/${id}/follow`);
      update(saved);
    } catch (err) {
      update(previous);
      toast.error(err.message);
    }
  };

  const loading = Boolean(term && result?.term !== term);
  return (
    <section className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Qidiruv</h1>
      <label className="input input-bordered flex items-center gap-3">
        <FiSearch aria-hidden="true" />
        <input type="search" className="min-w-0 grow" aria-label="Foydalanuvchini qidirish"
          placeholder="@username" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      {loading && (
        <div role="status" className="space-y-3">
          <span className="sr-only">Qidirilmoqda…</span>
          {[0, 1, 2].map((row) => <div key={row} className="skeleton h-16 rounded-xl" />)}
        </div>
      )}
      {term && result?.term === term && (
        result.error ? <p role="status">Qidiruvni amalga oshirib bo‘lmadi.</p>
        : !result.users.length ? <p role="status">Hech kim topilmadi.</p>
        : <ul className="divide-y divide-base-300">
          {result.users.map((user) => {
            const { isFollowing, followersCount, pending } = followChanges[user._id] || user;
            return (
              <li key={user._id} className="flex items-center gap-2 py-3">
                <Link to={`/profile/${encodeURIComponent(user.username)}`}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-lg">
                  <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-base-200 font-semibold">
                    {user.avatar
                      ? <img src={imageUrl(user.avatar)} alt="" className="size-full object-cover" />
                      : user.username.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">@{user.username}</span>
                    {user.fullName && <span className="block truncate text-sm">{user.fullName}</span>}
                    <span className="block text-xs text-base-content/70">{followersCount} kuzatuvchi</span>
                  </span>
                </Link>
                <button type="button" disabled={pending} aria-pressed={isFollowing}
                  className={`btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => toggleFollow(user)}>
                  {isFollowing ? 'Kuzatilmoqda' : 'Kuzatish'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Search;
