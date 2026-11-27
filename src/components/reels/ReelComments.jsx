import { FiX } from 'react-icons/fi';
import { imageUrl } from '../../api/client';

const ReelComments = ({ open, comments, commentText, onCommentTextChange, onSubmit, submitting, onClose }) => {
  if (!open) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 max-h-[55%] rounded-t-2xl border-t border-white/10 bg-black/95 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Izohlar</h3>
        <button
          type="button"
          aria-label="Izohlarni yopish"
          onClick={onClose}
          className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto px-4 py-3 no-scrollbar">
        {comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-white/50">Hozircha izoh yo‘q. Birinchi bo‘ling!</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment._id} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-xs font-bold text-white"
                >
                  {comment.author?.avatar
                    ? <img src={imageUrl(comment.author.avatar)} alt="" className="h-full w-full object-cover" />
                    : (comment.author?.username || '?').charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{comment.author?.username}</p>
                  <p className="break-words text-sm text-white/85">{comment.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 px-4 py-3">
        <input
          type="text"
          value={commentText}
          onChange={(event) => onCommentTextChange(event.target.value)}
          placeholder="Izoh yozing..."
          maxLength={1000}
          className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-white/30 focus:ring-1"
        />
        <button
          type="submit"
          disabled={submitting || !commentText.trim()}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? '...' : 'Yuborish'}
        </button>
      </form>
    </div>
  );
};

export default ReelComments;
