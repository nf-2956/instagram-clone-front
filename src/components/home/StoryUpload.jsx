import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { api } from '../../api/client';

const NEW = '__new__';

// Preview of the chosen story photo + optional "add to highlights"
const StoryUpload = ({ file, onClose, onDone }) => {
  const [preview, setPreview] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [target, setTarget] = useState('');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    let ignore = false;
    api.get('/stories/highlights')
      .then((data) => { if (!ignore) setHighlights(data.highlights); })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const form = new FormData();
    form.append('image', file);
    if (target === NEW) form.append('highlightName', newName.trim());
    else if (target) form.append('highlightId', target);

    setSaving(true);
    try {
      const data = await api.post('/stories', form);
      toast.success(data.highlight ? `Istoriya qo‘shildi va "${data.highlight.name}"ga saqlandi` : 'Istoriya qo‘shildi');
      onDone();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="story-upload-title">
      <form onSubmit={submit} className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
          <h2 id="story-upload-title" className="font-semibold">Yangi istoriya</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Yopish" className="btn btn-ghost btn-circle btn-sm"><FiX size={18} /></button>
        </div>
        <div className="space-y-4 p-4">
          {preview && <img src={preview} alt="Tanlangan istoriya" className="mx-auto max-h-[45vh] rounded-xl object-contain" />}
          <label className="form-control w-full">
            <span className="label-text mb-1 text-sm">Aktualniyga qo‘shish</span>
            <select value={target} onChange={(event) => setTarget(event.target.value)} disabled={saving} className="select select-bordered select-sm w-full">
              <option value="">Yo‘q, faqat istoriya</option>
              {highlights.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
              <option value={NEW}>+ Yangi highlight</option>
            </select>
          </label>
          {target === NEW && (
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              maxLength={24}
              required
              disabled={saving}
              placeholder="Highlight nomi"
              aria-label="Yangi highlight nomi"
              className="input input-bordered input-sm w-full"
            />
          )}
          <button type="submit" disabled={saving || (target === NEW && !newName.trim())} className="btn btn-primary btn-sm w-full">
            {saving && <span className="loading loading-spinner loading-xs" />}
            {saving ? 'Joylanmoqda...' : 'Joylash'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryUpload;
