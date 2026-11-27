import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiImage, FiUpload, FiX } from 'react-icons/fi';
import { api, imageUrl } from '../api/client';

const MAX_SIZE = 5 * 1024 * 1024;
const MAX_CAPTION = 2200;

const Post = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const submittingRef = useRef(false);
  const [photo, setPhoto] = useState(null);
  const [imageReady, setImageReady] = useState(false);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const username = user?.username || 'siz';

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.url);
  }, [photo]);

  const selectPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    setPhoto(null);
    setImageReady(false);
    if (!file.type.startsWith('image/')) {
      setError('Faqat rasm faylini tanlang.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Rasm hajmi 5 MB dan oshmasligi kerak.');
      return;
    }
    setPhoto({ file, url: URL.createObjectURL(file) });
  };

  const removePhoto = () => {
    setPhoto(null);
    setImageReady(false);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setError('');
    try {
      if (!photo?.file.type.startsWith('image/')) throw new Error('Avval rasm tanlang.');
      if (photo.file.size > MAX_SIZE) throw new Error('Rasm hajmi 5 MB dan oshmasligi kerak.');
      if (!imageReady) throw new Error('Rasm ochilishini kuting yoki boshqa rasm tanlang.');
      if (caption.length > MAX_CAPTION) throw new Error('Izoh 2200 belgidan oshmasligi kerak.');
      submittingRef.current = true;
      setLoading(true);
      const form = new FormData();
      form.append('image', photo.file);
      form.append('caption', caption.trim());
      await api.post('/posts', form);
      toast.success('Post muvaffaqiyatli joylandi!');
      navigate('/');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          disabled={loading}
          aria-label="Bosh sahifaga qaytish"
          className="btn btn-ghost btn-circle btn-sm shrink-0"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Yangi post</h1>
          <p className="mt-1 text-sm text-base-content/60">Rasm tanlang va izoh yozing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm" aria-busy={loading}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 border-b border-base-300 lg:border-b-0 lg:border-r">
            <input
              ref={inputRef}
              id="post-image"
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={selectPhoto}
              aria-label="Post uchun rasm tanlash"
              aria-describedby="post-image-help"
              className="sr-only"
            />
            {photo ? (
              <div className="relative flex aspect-square items-center justify-center bg-base-200">
                <img
                  src={photo.url}
                  alt="Tanlangan post rasmi"
                  className="h-full w-full object-contain"
                  onLoad={() => setImageReady(true)}
                  onError={() => {
                    setImageReady(false);
                    setError('Rasmni ochib bo`lmadi. Boshqa rasm tanlang.');
                  }}
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={loading}
                  aria-label="Tanlangan rasmni olib tashlash"
                  className="btn btn-circle btn-sm absolute right-3 top-3 border-base-300 bg-base-100 text-base-content shadow-sm"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <div className="m-4 flex min-h-72 flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-200/40 px-5 py-12 text-center sm:min-h-80">
                <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100 text-primary shadow-sm">
                  <FiImage size={32} strokeWidth={1.5} />
                </span>
                <h2 className="text-lg font-semibold">Rasmingizni tanlang</h2>
                <p className="mb-6 mt-2 max-w-52 text-sm leading-relaxed text-base-content/60">Ulashmoqchi bo`lgan rasmingizni qurilmangizdan yuklang.</p>
                <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-primary btn-sm gap-2 normal-case">
                  <FiUpload size={16} /> Rasm tanlash
                </button>
              </div>
            )}
            <div className="flex min-h-14 items-center justify-between gap-3 border-t border-base-300 px-4 py-3">
              <p id="post-image-help" className="text-xs text-base-content/60">Faqat rasm, 5 MB gacha</p>
              {photo && (
                <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="btn btn-ghost btn-xs text-primary normal-case">Almashtirish</button>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="avatar placeholder shrink-0">
                <div className="w-10 rounded-full bg-base-200 text-base-content">
                  {user?.avatar ? <img src={imageUrl(user.avatar)} alt="" /> : <span className="text-sm font-semibold">{username[0].toUpperCase()}</span>}
                </div>
              </div>
              <span className="truncate text-sm font-semibold">{username}</span>
            </div>
            <label htmlFor="post-caption" className="mb-2 text-sm font-medium">Izoh</label>
            <textarea
              id="post-caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={MAX_CAPTION}
              disabled={loading}
              placeholder="Rasmingiz haqida yozing..."
              aria-describedby="post-caption-count"
              className="textarea textarea-bordered min-h-40 w-full resize-y text-sm leading-relaxed focus:textarea-primary lg:flex-1"
            />
            <p id="post-caption-count" aria-live="polite" className="mb-5 mt-2 text-right text-xs tabular-nums text-base-content/60">{caption.length} / {MAX_CAPTION}</p>
            <button type="submit" disabled={loading || !photo || !imageReady} className="btn btn-primary w-full gap-2 normal-case">
              {loading && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
              {loading ? 'Joylanmoqda...' : 'Joylash'}
            </button>
          </div>
        </div>
        {error && <p role="alert" className="border-t border-base-300 bg-error/10 px-5 py-4 text-sm text-error">{error}</p>}
      </form>
    </section>
  );
};

export default Post;
