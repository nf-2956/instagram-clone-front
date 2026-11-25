import { FiPlus } from 'react-icons/fi';

const TABS = [
  { id: 'reels', label: 'Reels' },
  { id: 'friends', label: 'Friends' },
];

const ReelsTopBar = ({ activeTab, onTabChange, onCreate }) => (
  <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-gradient-to-b from-black/60 via-black/20 to-transparent px-4">
    <button
      type="button"
      aria-label="Yangi reel yaratish"
      onClick={onCreate}
      className="pointer-events-auto rounded-full p-2 text-white transition hover:bg-white/10 active:scale-90"
    >
      <FiPlus size={24} />
    </button>

    <nav className="pointer-events-auto flex items-center gap-6" aria-label="Reels bo‘limlari">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-current={activeTab === id ? 'page' : undefined}
          onClick={() => onTabChange(id)}
          className={`relative pb-1 text-[15px] transition-colors ${
            activeTab === id
              ? 'font-semibold text-white'
              : 'font-medium text-white/60 hover:text-white'
          }`}
        >
          {label}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-white transition-opacity ${
              activeTab === id ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      ))}
    </nav>

    <span className="w-10" aria-hidden="true" />
  </header>
);

export default ReelsTopBar;
