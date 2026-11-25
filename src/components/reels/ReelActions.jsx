import { FiBookmark, FiHeart, FiMessageCircle, FiRepeat, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const formatCount = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${value}`;
};

const ActionButton = ({
  icon: Icon,
  label,
  count,
  filled = false,
  highlight = false,
  pressed,
  iconClassName = '',
  onClick,
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors active:scale-90 ${
      highlight ? 'text-[#ff3040]' : 'text-white hover:text-white/75'
    }`}
  >
    <Icon size={26} fill={filled ? 'currentColor' : 'none'} className={iconClassName} />
    <span className="text-xs font-semibold tabular-nums">{formatCount(count)}</span>
  </button>
);

const ReelActions = ({ reel, liked, saved, onToggleLike, onToggleSave }) => {
  const showNotice = (message) => toast.info(message);

  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      <ActionButton
        icon={FiHeart}
        label={liked ? 'Yoqdi bekor qilish' : 'Yoqdi'}
        count={reel.likes}
        filled={liked}
        highlight={liked}
        pressed={liked}
        iconClassName={liked ? 'like-pop' : ''}
        onClick={onToggleLike}
      />
      <ActionButton
        icon={FiMessageCircle}
        label="Izohlar"
        count={reel.comments}
        onClick={() => showNotice('Izohlar bo‘limi hozircha mavjud emas')}
      />
      <ActionButton
        icon={FiRepeat}
        label="Repost"
        count={reel.reposts}
        onClick={() => showNotice('Repost demo rejimda mavjud emas')}
      />
      <ActionButton
        icon={FiSend}
        label="Ulashish"
        count={reel.shares}
        onClick={() => showNotice('Ulashish demo rejimda mavjud emas')}
      />
      <ActionButton
        icon={FiBookmark}
        label={saved ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}
        count={reel.saves}
        filled={saved}
        pressed={saved}
        onClick={onToggleSave}
      />
    </div>
  );
};

export default ReelActions;
