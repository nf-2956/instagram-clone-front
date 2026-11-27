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
  activeAccent = false,
  pressed,
  iconClassName = '',
  onClick,
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={`group flex flex-col items-center gap-1 transition active:scale-90 ${
      highlight
        ? 'text-[#ff3040]'
        : activeAccent
          ? 'text-[#00c853]'
          : 'text-white hover:text-white/75'
    }`}
  >
    <span className="relative">
      <Icon
        size={27}
        fill={filled ? 'currentColor' : 'none'}
        strokeWidth={filled ? 0 : 1.8}
        className={iconClassName}
      />
      {pressed && !filled && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-current"
        />
      )}
    </span>
    <span className="text-[12px] font-semibold tabular-nums leading-none">{formatCount(count)}</span>
  </button>
);

const ReelActions = ({
  reel,
  liked,
  saved,
  reposted,
  commentsOpen,
  onToggleLike,
  onToggleSave,
  onToggleRepost,
  onToggleComments,
}) => {
  const showNotice = (message) => toast.info(message);

  return (
    <div className="flex shrink-0 flex-col items-center gap-[18px] pb-1">
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
        filled={commentsOpen}
        pressed={commentsOpen}
        onClick={onToggleComments}
      />
      <ActionButton
        icon={FiRepeat}
        label={reposted ? 'Repostni bekor qilish' : 'Repost'}
        count={reel.reposts}
        filled={reposted}
        activeAccent={reposted}
        pressed={reposted}
        iconClassName={reposted ? 'repost-pop' : ''}
        onClick={onToggleRepost}
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
        iconClassName={saved ? 'like-pop' : ''}
        onClick={onToggleSave}
      />
    </div>
  );
};

export default ReelActions;
