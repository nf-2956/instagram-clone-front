import { useRef, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Search = () => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const searchTerm = query.trim().replace(/^@/, '').toLowerCase();
  const { registeredUsers, user } = useSelector((state) => state.auth);
  const currentUsername = user?.username?.trim().toLowerCase();
  const matchingUsers = registeredUsers
    .map((entry) => typeof entry === 'string' ? entry : entry.username)
    .filter((username) => {
      const handle = username.toLowerCase();
      return handle !== currentUsername && handle.includes(searchTerm);
    });

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <section aria-labelledby="search-heading" className="p-4 sm:p-6 md:p-8">
      <h1 id="search-heading" className="mb-5 text-2xl font-semibold">
        Qidiruv
      </h1>

      <div role="search" className="relative mb-6">
        <label htmlFor="user-search" className="sr-only">
          Foydalanuvchilarni qidirish
        </label>
        <FiSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          ref={inputRef}
          id="user-search"
          type="text"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="@username"
          className="input input-bordered w-full bg-base-200 pl-11 pr-12"
        />
        {query && (
          <button
            type="button"
            aria-label="Qidiruvni tozalash"
            onClick={clearSearch}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
          >
            <FiX aria-hidden="true" className="text-lg" />
          </button>
        )}
      </div>

      <h2 className="mb-3 text-base font-semibold">Foydalanuvchilar</h2>
      <p role="status" className={matchingUsers.length ? 'sr-only' : 'py-8 text-center text-base-content/70'}>
        {matchingUsers.length
          ? `${matchingUsers.length} ta foydalanuvchi`
          : 'Foydalanuvchi topilmadi.'}
      </p>

      {matchingUsers.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
          {matchingUsers.map((username) => (
            <li key={username} className="flex min-w-0 items-center gap-3 rounded-xl border border-base-300 p-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-semibold text-violet-900"
              >
                {username.slice(0, 2).toUpperCase()}
              </span>
              <p className="min-w-0 break-words text-sm font-semibold">@{username}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Search;
