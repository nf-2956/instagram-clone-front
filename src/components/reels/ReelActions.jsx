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
        ? 'text-error'
        : activeAccent
          ? 'text-success'
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
    {count !== undefined && (
      <span className="text-[12px] font-semibold tabular-nums leading-none">{formatCount(count)}</span>
    )}
  </button>
);

const ReelActions = ({
  counts,
  liked,
  saved,
  reposted,
  commentsOpen,
  onToggleLike,
  onToggleSave,
  onToggleRepost,
  onToggleComments,
}) => {
  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/reels`);
      toast.info('Havola nusxalandi');
    } catch {
      toast.error("Havolani nusxalab bo'lmadi");
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-[18px] pb-1">
      <ActionButton
        icon={FiHeart}
        label={liked ? 'Yoqdi bekor qilish' : 'Yoqdi'}
        count={counts.likes}
        filled={liked}
        highlight={liked}
        pressed={liked}
        iconClassName={liked ? 'like-pop' : ''}
        onClick={onToggleLike}
      />
      <ActionButton
        icon={FiMessageCircle}
        label="Izohlar"
        count={counts.comments}
        filled={commentsOpen}
        pressed={commentsOpen}
        onClick={onToggleComments}
      />
      <ActionButton
        icon={FiRepeat}
        label={reposted ? 'Repostni bekor qilish' : 'Repost'}
        count={counts.reposts}
        filled={reposted}
        activeAccent={reposted}
        pressed={reposted}
        iconClassName={reposted ? 'repost-pop' : ''}
        onClick={onToggleRepost}
      />
      <ActionButton
        icon={FiSend}
        label="Ulashish"
        onClick={share}
      />
      <ActionButton
        icon={FiBookmark}
        label={saved ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}
        count={counts.saves}
        filled={saved}
        pressed={saved}
        iconClassName={saved ? 'like-pop' : ''}
        onClick={onToggleSave}
      />
    </div>
  );
};

export default ReelActions;
