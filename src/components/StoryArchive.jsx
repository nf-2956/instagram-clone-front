import { useRef, useState } from 'react';
import { FiArchive, FiArrowLeft, FiImage, FiTrash2 } from 'react-icons/fi';
import { api } from '../api/client';
import ArchivedStoryImage from './ArchivedStoryImage';

const dateFormat = new Intl.DateTimeFormat('uz-UZ', { dateStyle: 'medium' });

export default function StoryArchive() {
  const dialog = useRef(null);
  const [stories, setStories] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function open() {
    setStories(null);
    setError('');
    dialog.current.showModal();
    try {
      setStories((await api.get('/stories/archive')).stories);
    } catch (error) {
      setError(error.message);
    }
  }

  function select(id) {
    setSelected(id);
    setConfirming(false);
    setError('');
  }

  // Deleting from the archive removes the story completely (also from highlights)
  async function remove() {
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/stories/${selected}`);
      setStories((current) => current.filter((story) => story._id !== selected));
      select(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-sm btn-outline" onClick={open}>
        <FiArchive aria-hidden="true" /> Arxivni ko‘rish
      </button>
      <dialog ref={dialog} className="story-archive" aria-labelledby="archive-title" onClose={() => select(null)}>
        <div className="profile-photo-header">
          <h2 id="archive-title">Storylar arxivi</h2>
          <form method="dialog"><button type="submit">Yopish</button></form>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {!stories && !error && <p role="status">Yuklanmoqda…</p>}
        {stories?.length === 0 && <p>Hozircha arxivda story yo‘q.</p>}
        {selected ? (
          <figure className="archive-preview">
            <button type="button" onClick={() => select(null)}><FiArrowLeft aria-hidden="true" /> Arxivga qaytish</button>
            <ArchivedStoryImage key={selected} id={selected} />
            {confirming ? (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">Butunlay o‘chirilsinmi?</span>
                <button type="button" className="btn btn-sm btn-error" disabled={deleting} onClick={remove}>
                  {deleting ? 'O‘chirilmoqda…' : 'Ha, o‘chirish'}
                </button>
                <button type="button" className="btn btn-sm btn-ghost" disabled={deleting} onClick={() => setConfirming(false)}>Bekor</button>
              </div>
            ) : (
              <button type="button" className="btn btn-sm btn-ghost mt-3 text-error" onClick={() => setConfirming(true)}>
                <FiTrash2 aria-hidden="true" /> Arxivdan o‘chirish
              </button>
            )}
          </figure>
        ) : (
          <ul className="archive-grid">
            {stories?.map((story) => (
              <li key={story._id}>
                <button type="button" onClick={() => select(story._id)}>
                  <FiImage className="mx-auto my-2 text-xl" aria-hidden="true" />
                  <time dateTime={story.createdAt}>{dateFormat.format(new Date(story.createdAt))}</time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </dialog>
    </>
  );
}
