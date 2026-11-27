import { useCallback, useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiHeart, FiRepeat, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  addComment,
  getComments,
  toggleFollow,
  toggleLike,
  toggleRepost,
  toggleSave,
  videoUrl,
} from '../../api/reels';
import ReelActions from './ReelActions';
import ReelComments from './ReelComments';
import ReelInfo from './ReelInfo';

const BURST_DURATION = 950;
const REPOST_BADGE_DURATION = 1600;

// Optimistic toggle: change the UI first, then confirm with the server or roll back
const useToggle = (initialActive, initialCount) => {
  const [state, setState] = useState({ active: initialActive, count: initialCount });
  const run = async (request, flagKey, countKey) => {
    const previous = state;
    setState({ active: !previous.active, count: previous.count + (previous.active ? -1 : 1) });
    try {
      const result = await request();
      setState({ active: result[flagKey], count: result[countKey] });
      return result;
    } catch (error) {
      setState(previous);
      throw error;
    }
  };
  return [state, run];
};

const ReelCard = ({ reel, muted, onToggleMute, onFollowChange }) => {
  const [like, runLike] = useToggle(reel.isLiked, reel.likesCount);
  const [save, runSave] = useToggle(reel.isSaved, reel.savesCount);
  const [repost, runRepost] = useToggle(reel.isReposted, reel.repostsCount);
  const [followBusy, setFollowBusy] = useState(false);
  const [commentsCount, setCommentsCount] = useState(reel.commentsCount);
  const [commentList, setCommentList] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [repostFlash, setRepostFlash] = useState(false);
  const [paused, setPaused] = useState(false);
  const burstTimer = useRef(null);
  const repostTimer = useRef(null);
  const videoRef = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(burstTimer.current);
      window.clearTimeout(repostTimer.current);
    },
    [],
  );

  // Play only the reel that is on screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setPaused(false);
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  const handleLike = useCallback(async () => {
    if (!like.active) {
      setBurstId((current) => current + 1);
      window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBurstId(0), BURST_DURATION);
    }
    try {
      await runLike(() => toggleLike(reel._id), 'isLiked', 'likesCount');
    } catch (e) {
      toast.error(e.message || 'Like saqlanmadi');
    }
  }, [like.active, reel._id, runLike]);

  const handleDoubleTap = () => {
    if (!like.active) handleLike();
  };

  const handleRepost = async () => {
    if (!repost.active) {
      setRepostFlash(true);
      window.clearTimeout(repostTimer.current);
      repostTimer.current = window.setTimeout(() => setRepostFlash(false), REPOST_BADGE_DURATION);
    }
    try {
      const result = await runRepost(() => toggleRepost(reel._id), 'isReposted', 'repostsCount');
      toast.success(result.message);
    } catch (e) {
      setRepostFlash(false);
      toast.error(e.message || 'Repost saqlanmadi');
    }
  };

  const handleSave = async () => {
    try {
      const result = await runSave(() => toggleSave(reel._id), 'isSaved', 'savesCount');
      toast.success(result.message);
    } catch (e) {
      toast.error(e.message || 'Saqlashda xatolik');
    }
  };

  const handleFollow = async () => {
    if (followBusy) return;
    setFollowBusy(true);
    try {
      const result = await toggleFollow(reel.author._id);
      onFollowChange?.(reel.author._id, result.isFollowing);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setFollowBusy(false);
    }
  };

  const toggleComments = async () => {
    const opening = !showComments;
    setShowComments(opening);
    if (!opening) return;
    try {
      const result = await getComments(reel._id);
      setCommentList(result.comments);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    try {
      const result = await addComment(reel._id, text);
      setCommentList((list) => [result.comment, ...list]);
      setCommentsCount(result.commentsCount);
      setCommentText('');
    } catch (e) {
      toast.error(e.message || 'Izoh saqlanmadi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="relative h-full w-full max-w-[450px] shrink-0 overflow-hidden bg-black">
      <div className="absolute inset-0 touch-manipulation select-none" onDoubleClick={handleDoubleTap}>
        <video
          ref={videoRef}
          src={videoUrl(reel)}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          playsInline
          muted={muted}
          preload="metadata"
          onClick={togglePlay}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/65 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {paused && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/45 px-4 py-2 text-sm font-semibold text-white">Pauza</span>
          </div>
        )}

        {burstId > 0 && (
          <div key={burstId} aria-hidden="true" className="reel-burst pointer-events-none absolute left-1/2 top-1/2 z-20">
            <FiHeart size={110} fill="currentColor" className="text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
        className="absolute right-3 top-16 z-20 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
      >
        {muted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
      </button>

      {(repostFlash || repost.active) && (
        <div
          className={`pointer-events-none absolute left-4 top-16 z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md transition-all duration-300 ${
            repostFlash
              ? 'border-success/60 bg-success/25 text-success opacity-100'
              : 'border-white/20 bg-black/45 text-white/90 opacity-100'
          }`}
        >
          <FiRepeat size={13} className={repostFlash ? 'repost-pop' : ''} />
          <span>{repostFlash ? 'Repost qilindi' : 'Repost qilingan'}</span>
          <FiCheckCircle size={12} className="text-success" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 px-4 pb-20 md:pb-6">
        <ReelInfo reel={reel} following={reel.isFollowingAuthor} followBusy={followBusy} onToggleFollow={handleFollow} />
        <ReelActions
          counts={{ likes: like.count, comments: commentsCount, reposts: repost.count, saves: save.count }}
          liked={like.active}
          saved={save.active}
          reposted={repost.active}
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
