import { FiCamera, FiPlus } from 'react-icons/fi';

const TABS = [
  { id: 'reels', label: 'Reels' },
  { id: 'friends', label: 'Friends' },
];

const ReelsTopBar = ({ activeTab, onTabChange, onCreate }) => (
  <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-gradient-to-b from-black/70 via-black/25 to-transparent px-3">
    <button
      type="button"
      aria-label="Yangi reel yaratish"
      onClick={onCreate}
      className="pointer-events-auto rounded-full p-2 text-white transition hover:bg-white/10 active:scale-90"
    >
      <FiCamera size={22} />
    </button>

    <nav className="pointer-events-auto flex items-center gap-7" aria-label="Reels bo‘limlari">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-current={activeTab === id ? 'page' : undefined}
          onClick={() => onTabChange(id)}
          className={`relative pb-1 text-[16px] transition-colors ${
            activeTab === id
              ? 'font-bold text-white'
              : 'font-medium text-white/55 hover:text-white/85'
          }`}
        >
          {label}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-white transition-opacity ${
              activeTab === id ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      ))}
    </nav>

    <button
      type="button"
      aria-label="Yangi reel"
      onClick={onCreate}
      className="pointer-events-auto rounded-full p-2 text-white transition hover:bg-white/10 active:scale-90"
    >
      <FiPlus size={22} />
    </button>
  </header>
);

export default ReelsTopBar;
