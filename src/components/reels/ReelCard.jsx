import { useCallback, useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiHeart, FiRepeat } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addComment, getComments, getReelState, toggleLike, toggleRepost, toggleSave } from '../../api/reels';
import ReelActions from './ReelActions';
import ReelComments from './ReelComments';
import ReelInfo from './ReelInfo';

const BURST_DURATION = 950;
const REPOST_BADGE_DURATION = 1600;

const ReelCard = ({ reel }) => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.email || user?.username || '';

  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [reposts, setReposts] = useState(reel.reposts);
  const [saves, setSaves] = useState(reel.saves);
  const [comments, setComments] = useState(reel.comments);
  const [commentList, setCommentList] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [repostFlash, setRepostFlash] = useState(false);
  const burstTimer = useRef(null);
  const repostTimer = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(burstTimer.current);
      window.clearTimeout(repostTimer.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const loadState = async () => {
      try {
        const state = await getReelState(reel.id, userId);
        if (cancelled) return;
        setLiked(Boolean(state.liked));
        setReposted(Boolean(state.reposted));
        setSaved(Boolean(state.saved));
        setLikes(state.likes);
        setReposts(state.reposts);
        if (typeof state.saves === 'number') setSaves(state.saves);
        setComments(state.comments);
      } catch {
        // backend ishlamasa mock qiymatlar qoladi
      }
    };

    loadState();
    return () => {
      cancelled = true;
    };
  }, [reel.id, userId]);

  const handleLike = useCallback(async () => {
    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!prevLiked);
    setLikes(prevLikes + (prevLiked ? -1 : 1));
    if (!prevLiked) {
      setBurstId((current) => current + 1);
      window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBurstId(0), BURST_DURATION);
    }

    try {
      const result = await toggleLike(reel.id, userId);
      setLiked(result.liked);
      setLikes(result.likes);
    } catch (e) {
      setLiked(prevLiked);
      setLikes(prevLikes);
      toast.error(e.message || 'Like saqlanmadi');
    }
  }, [liked, likes, reel.id, userId]);

  const handleDoubleTap = () => {
    if (!liked) handleLike();
  };

  const handleRepost = useCallback(async () => {
    const prevReposted = reposted;
    const prevReposts = reposts;
    setReposted(!prevReposted);
    setReposts(prevReposts + (prevReposted ? -1 : 1));

    if (!prevReposted) {
      setRepostFlash(true);
      window.clearTimeout(repostTimer.current);
      repostTimer.current = window.setTimeout(() => setRepostFlash(false), REPOST_BADGE_DURATION);
    }

    try {
      const result = await toggleRepost(reel.id, userId);
      setReposted(result.reposted);
      setReposts(result.reposts);
      toast.success(result.message);
    } catch (e) {
      setReposted(prevReposted);
      setReposts(prevReposts);
      setRepostFlash(false);
      toast.error(e.message || 'Repost saqlanmadi');
    }
  }, [reposted, reposts, reel.id, userId]);

  const handleSave = useCallback(async () => {
    const prevSaved = saved;
    const prevSaves = saves;
    setSaved(!prevSaved);
    setSaves(prevSaves + (prevSaved ? -1 : 1));

    try {
      const result = await toggleSave(reel.id, userId);
      setSaved(result.saved);
      setSaves(result.saves);
      toast.success(result.message);
    } catch (e) {
      setSaved(prevSaved);
      setSaves(prevSaves);
      toast.error(e.message || 'Saqlashda xatolik');
    }
  }, [saved, saves, reel.id, userId]);

  const toggleComments = useCallback(async () => {
    setShowComments((value) => !value);
    if (showComments) return;

    try {
      const result = await getComments(reel.id);
      setCommentList(result.comments || []);
    } catch {
      // kommentlarni olib bo'lmasa bo'sh qoladi
    }
  }, [showComments, reel.id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    try {
      const result = await addComment(reel.id, userId, text);
      setCommentList((list) => [result.comment, ...list]);
      setComments(result.comments);
      setCommentText('');
      toast.success('Komment qo‘shildi');
    } catch (e) {
      toast.error(e.message || 'Komment saqlanmadi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="relative h-full w-full max-w-[450px] shrink-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0 touch-manipulation select-none"
        onDoubleClick={handleDoubleTap}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="reel-media absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]"
            style={{
              background: `linear-gradient(160deg, ${reel.media[0]} 0%, ${reel.media[1]} 100%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.25) 0 1px, transparent 1px)',
              backgroundSize: '48px 48px, 32px 32px',
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/65 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {burstId > 0 && (
          <div
            key={burstId}
            aria-hidden="true"
            className="reel-burst pointer-events-none absolute left-1/2 top-1/2 z-20"
          >
            <FiHeart size={110} fill="currentColor" className="text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]" />
          </div>
        )}
      </div>

      {(repostFlash || reposted) && (
        <div
          className={`pointer-events-none absolute left-4 top-16 z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md transition-all duration-300 ${
            repostFlash
              ? 'border-[#00c853]/60 bg-[#00c853]/25 text-[#69f0ae] opacity-100 translate-y-0'
              : 'border-white/20 bg-black/45 text-white/90 opacity-100'
          }`}
        >
          <FiRepeat size={13} className={repostFlash ? 'repost-pop' : ''} />
          <span>{repostFlash ? 'Repost qilindi' : 'Repost qilingan'}</span>
          <FiCheckCircle size={12} className={repostFlash ? 'text-[#69f0ae]' : 'text-[#00c853]'} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 px-4 pb-20 md:pb-6">
        <ReelInfo
          reel={reel}
          following={following}
          onToggleFollow={() => setFollowing((value) => !value)}
        />
        <ReelActions
          reel={{ ...reel, likes, reposts, comments, saves }}
          liked={liked}
          saved={saved}
          reposted={reposted}
          onToggleLike={handleLike}
          onToggleSave={handleSave}
          onToggleRepost={handleRepost}
          onToggleComments={toggleComments}
          commentsOpen={showComments}
        />
      </div>

      <ReelComments
        open={showComments}
        comments={commentList}
        commentText={commentText}
        onCommentTextChange={setCommentText}
        onSubmit={handleCommentSubmit}
        submitting={submitting}
        onClose={() => setShowComments(false)}
      />
    </article>
  );
};

export default ReelCard;
