import { useEffect, useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { createReel } from '../../api/reels';

const MAX_SIZE = 15 * 1024 * 1024;
const MAX_SECONDS = 60;
const TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_CAPTION = 2200;

// Modal for uploading a new reel: pick a video, preview it, write a caption
const ReelUpload = ({ open, onClose, onCreated }) => {
  const inputRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => () => {
    if (video) URL.revokeObjectURL(video.url);
  }, [video]);

  if (!open) return null;

  const reset = () => {
    setVideo(null);
    setCaption('');
    setError('');
  };

  const close = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const pick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    if (!TYPES.includes(file.type)) {
      setError('Faqat video: mp4, webm yoki mov.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Video 15 MB dan oshmasligi kerak.');
      return;
    }
    setVideo({ file, url: URL.createObjectURL(file) });
  };

  // The browser knows the duration only after the metadata loads
  const checkDuration = (event) => {
    if (event.currentTarget.duration > MAX_SECONDS + 0.5) {
      setError('Video 60 soniyadan uzun bo‘lmasin.');
      setVideo(null);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!video || loading) return;
    setLoading(true);
    setError('');
    try {
      const { reel } = await createReel(video.file, caption.trim());
      toast.success('Reel joylandi');
      reset();
      onCreated(reel);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="reel-upload-title">
      <form onSubmit={submit} className="card w-full max-w-md bg-base-100 text-base-content shadow-xl">
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-3">
          <h2 id="reel-upload-title" className="font-semibold">Yangi reel</h2>
          <button type="button" onClick={close} disabled={loading} aria-label="Yopish" className="btn btn-ghost btn-circle btn-sm">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={pick} className="sr-only" aria-label="Video tanlash" />
          {video ? (
            <div className="relative mx-auto aspect-[9/16] max-h-[50vh] overflow-hidden rounded-xl bg-black">
              <video src={video.url} className="h-full w-full object-contain" controls muted playsInline onLoadedMetadata={checkDuration} />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-base-300 px-4 py-12 text-center hover:bg-base-200"
            >
              <FiUpload size={28} className="text-primary" />
              <span className="font-semibold">Video tanlang</span>
              <span className="text-xs text-base-content/60">mp4, webm, mov · 15 MB · 60 soniyagacha</span>
            </button>
          )}
          {video && (
            <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="btn btn-ghost btn-xs text-primary">
              Boshqa video
            </button>
          )}

          <div>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={MAX_CAPTION}
              disabled={loading}
              placeholder="Izoh yozing..."
              className="textarea textarea-bordered w-full resize-none text-sm"
              rows={3}
            />
            <p className="text-right text-xs tabular-nums text-base-content/60">{caption.length} / {MAX_CAPTION}</p>
          </div>

          {error && <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}

          <button type="submit" disabled={!video || loading} className="btn btn-primary w-full">
            {loading && <span className="loading loading-spinner loading-sm" />}
            {loading ? 'Yuklanmoqda...' : 'Joylash'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReelUpload;
