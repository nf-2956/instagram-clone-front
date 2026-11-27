import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiImage, FiMessageCircle, FiMoreHorizontal, FiSend, FiTrash2 } from 'react-icons/fi';
import { api, imageUrl } from '../../api/client';

const timeAgo = (value) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (!Number.isFinite(seconds)) return '';
  if (seconds < 60) return 'hozir';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} daqiqa oldin`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} soat oldin`;
  return `${Math.floor(seconds / 86400)} kun oldin`;
};

const Avatar = ({ user, size = 'h-8 w-8' }) => user?.avatar
  ? <img src={imageUrl(user.avatar)} alt="" className={`${size} rounded-full object-cover`} />
  : <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-base-300 text-xs font-semibold uppercase`}>{user?.username?.[0] || '?'}</span>;

const PostCard = ({ post, onRepost, onDelete }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [likeBusy, setLikeBusy] = useState(false);
  const [repostBusy, setRepostBusy] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState(() => post.demo && post.commentsCount ? [{ _id: 'demo-comment', author: { username: 'sardor.travels' }, text: 'Ajoyib surat! 👏' }] : []);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [text, setText] = useState('');
  const [commentBusy, setCommentBusy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);

  const toggleLike = async () => {
    if (likeBusy) return;
    if (post.demo) {
      setLiked((value) => !value);
      setLikesCount((count) => count + (liked ? -1 : 1));
      return;
    }
    setLikeBusy(true);
    try {
      const data = await api.post(`/posts/${post._id}/like`);
      setLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLikeBusy(false);
    }
  };

  const openComments = async () => {
    if (commentsOpen) {
      setCommentsOpen(false);
      return;
    }
    setCommentsOpen(true);
    if (post.demo) {
      return;
    }
    setCommentsLoading(true);
    try {
      const data = await api.get(`/posts/${post._id}/comments`);
      setComments(data.comments);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const addComment = async (event) => {
    event.preventDefault();
    const commentText = text.trim();
    if (!commentText || commentBusy || commentsLoading) return;
    if (post.demo) {
      setComments((current) => [...current, { _id: crypto.randomUUID(), author: { username: 'siz' }, text: commentText }]);
      setCommentsCount((count) => count + 1);
      setCommentsOpen(true);
      setText('');
      return;
    }
    setCommentBusy(true);
    try {
      const data = await api.post(`/posts/${post._id}/comments`, { text: commentText });
      setComments((current) => [...current, data.comment]);
      setCommentsCount((count) => count + 1);
      setCommentsOpen(true);
      setText('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCommentBusy(false);
    }
  };

  const repost = async () => {
    if (repostBusy) return;
    if (post.demo) {
      toast.info('Bu namuna postni ulashib bo‘lmaydi');
      return;
    }
    setRepostBusy(true);
    try {
      await api.post(`/stories/repost/${post._id}`);
      toast.success('Post istoriyangizga ulashildi');
      onRepost?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRepostBusy(false);
    }
  };

  const author = post.author;
  const authorLink = author?.username ? `/profile/${author.username}` : '/profile';
  const isOwner = !post.demo && currentUser?._id && String(currentUser._id) === String(author?._id);

  const removePost = async () => {
    if (!window.confirm('Postni o‘chirmoqchimisiz?')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
      toast.success('Post o‘chirildi');
    } catch (error) {
      toast.error(error.message);
      setDeleting(false);
    }
  };

  const removeComment = async (comment) => {
    if (!window.confirm('Izohni o‘chirmoqchimisiz?')) return;
    setDeletingComment(comment._id);
    try {
      await api.delete(`/posts/${post._id}/comments/${comment._id}`);
      setComments((current) => current.filter((item) => item._id !== comment._id));
      setCommentsCount((count) => Math.max(0, count - 1));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingComment(null);
    }
  };

  return (
    <article className="card overflow-visible rounded-none border-b border-base-300 bg-base-100 pb-5 sm:rounded-2xl sm:border sm:shadow-sm">
      <header className="flex items-center gap-3 px-4 py-4">
        <span className="rounded-full bg-gradient-to-tr from-warning via-secondary to-primary p-[2px]"><span className="block rounded-full border-2 border-base-100"><Avatar user={author} size="h-9 w-9" /></span></span>
        <div className="min-w-0 flex-1 text-sm">
          {post.demo ? <span className="font-semibold">{author?.username}</span> : <Link to={authorLink} className="font-semibold hover:underline">{author?.username || 'Foydalanuvchi'}</Link>}
          <span className="ml-2 text-base-content/50">· {timeAgo(post.createdAt)}</span>
          <p className="mt-0.5 truncate text-xs text-base-content/50">{post.demo ? 'Namuna post' : author?.fullName || 'Instagram'}</p>
        </div>
        {isOwner && <div className="relative">
          <button type="button" aria-label="Post sozlamalari" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 hover:bg-base-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><FiMoreHorizontal size={21} /></button>
          {menuOpen && <div className="absolute right-0 top-full z-10 w-44 rounded-xl border border-base-300 bg-base-100 p-1 shadow-lg">
            <button type="button" disabled={deleting} onClick={removePost} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-base-200 disabled:opacity-50"><FiTrash2 /> {deleting ? 'O‘chirilmoqda…' : 'Postni o‘chirish'}</button>
          </div>}
        </div>}
      </header>

      {imageError ? <div className="flex aspect-square items-center justify-center bg-base-200 text-base-content/50"><span className="flex flex-col items-center gap-2 text-sm"><FiImage size={28} />Rasmni yuklab bo‘lmadi</span></div> : <img
        src={imageUrl(post.image)}
        alt={post.caption || `${author?.username || 'Foydalanuvchi'} posti`}
        className="max-h-[585px] min-h-[280px] w-full bg-base-200 object-contain"
        loading="lazy"
        onError={() => setImageError(true)}
        onDoubleClick={() => { if (!liked) toggleLike(); }}
      />}

      <div className="flex items-center gap-4 px-4 pt-4">
        <button type="button" className="rounded transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={liked ? 'Like bekor qilish' : 'Like bosish'} aria-pressed={liked} disabled={likeBusy} onClick={toggleLike}>
          {liked ? <FaHeart size={24} className="text-error" /> : <FiHeart size={24} />}
        </button>
        <button type="button" className="rounded transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label="Izohlarni ko‘rish" aria-expanded={commentsOpen} onClick={openComments}><FiMessageCircle size={24} /></button>
        <button type="button" className="rounded transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40" aria-label="Postni istoriyaga ulashish" title="Istoriyaga ulashish" disabled={repostBusy} onClick={repost}><FiSend size={22} /></button>
      </div>

      <div className="space-y-1.5 px-4 pt-3 text-sm">
        <p className="font-semibold">{likesCount.toLocaleString('uz-UZ')} ta yoqtirish</p>
        {post.caption && <p className="whitespace-pre-wrap break-words leading-relaxed"><span className="mr-1 font-semibold">{author?.username}</span>{expanded || post.caption.length <= 150 ? post.caption : `${post.caption.slice(0, 150).trimEnd()}…`}{post.caption.length > 150 && <button type="button" onClick={() => setExpanded(!expanded)} className="ml-1 text-base-content/55 hover:underline">{expanded ? 'kamroq' : 'yana'}</button>}</p>}
        {!commentsOpen && commentsCount > 0 && <button type="button" onClick={openComments} className="text-base-content/60 hover:underline">{commentsCount} ta izohni ko‘rish</button>}
        {commentsOpen && (
          <div className="mt-3 space-y-3 rounded-xl bg-base-200/60 p-3">
            {commentsLoading ? <span className="loading loading-spinner loading-sm" aria-label="Izohlar yuklanmoqda" /> : comments.length === 0 ? <p className="text-base-content/60">Hali izoh yo‘q</p> : comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-2"><p className="min-w-0 flex-1 break-words leading-relaxed"><span className="mr-1 font-semibold">{comment.author?.username || 'Foydalanuvchi'}</span>{comment.text}</p>{!post.demo && (isOwner || (currentUser?._id && String(currentUser._id) === String(comment.author?._id))) && <button type="button" onClick={() => removeComment(comment)} disabled={deletingComment !== null} aria-label="Izohni o‘chirish" className="rounded p-1 text-base-content/50 hover:text-error disabled:opacity-50"><FiTrash2 size={15} /></button>}</div>
            ))}
          </div>
        )}
      </div>

      {commentsOpen && (
        <form onSubmit={addComment} className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 py-1 focus-within:border-primary">
          <input value={text} onChange={(event) => setText(event.target.value)} maxLength={1000} placeholder="Izoh qoldiring…" aria-label="Yangi izoh" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
          {text.trim() && <button type="submit" disabled={commentBusy || commentsLoading} className="btn btn-ghost btn-xs text-primary disabled:opacity-50">{commentBusy ? 'Yuborilmoqda...' : 'Joylash'}</button>}
        </form>
      )}
    </article>
  );
};

export default PostCard;
