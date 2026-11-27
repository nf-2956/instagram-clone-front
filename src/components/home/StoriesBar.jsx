import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiChevronLeft, FiChevronRight, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { api, imageUrl } from '../../api/client';
import StoryUpload from './StoryUpload';

const sameId = (a, b) => String(a) === String(b);

const StoriesBar = ({ groups, currentUser, onChange }) => {
  const inputRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const group = activeGroup === null ? null : groups.find((item) => sameId(item.user._id, activeGroup));
  const story = group?.stories[storyIndex];
  const isOwnStory = group && sameId(group.user._id, currentUser?._id);

  const close = useCallback(() => {
    setActiveGroup(null);
    setStoryIndex(0);
    onChange();
  }, [onChange]);

  const next = () => {
    if (!group) return;
    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((index) => index + 1);
    } else {
      const index = groups.findIndex((item) => sameId(item.user._id, activeGroup));
      if (index < groups.length - 1) {
        setActiveGroup(groups[index + 1].user._id);
        setStoryIndex(0);
      } else close();
    }
    setProgressKey((key) => key + 1);
  };

  const previous = () => {
    if (storyIndex > 0) {
      setStoryIndex((index) => index - 1);
    } else {
      const index = groups.findIndex((item) => sameId(item.user._id, activeGroup));
      if (index > 0) {
        setActiveGroup(groups[index - 1].user._id);
        setStoryIndex(groups[index - 1].stories.length - 1);
      }
    }
    setProgressKey((key) => key + 1);
  };

  useEffect(() => {
    if (!story) return undefined;
    if (!story.demo) api.post(`/stories/${story._id}/view`).catch((error) => toast.error(error.message));
    const timer = window.setTimeout(() => {
      if (storyIndex < group.stories.length - 1) {
        setStoryIndex((index) => index + 1);
      } else {
        const index = groups.findIndex((item) => sameId(item.user._id, activeGroup));
        if (index < groups.length - 1) {
          setActiveGroup(groups[index + 1].user._id);
          setStoryIndex(0);
        } else {
          setActiveGroup(null);
          onChange();
        }
      }
      setProgressKey((key) => key + 1);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [story, storyIndex, activeGroup, group, groups, onChange]);

  useEffect(() => {
    if (activeGroup === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeGroup, close]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Faqat rasm tanlang');
    if (file.size > 5 * 1024 * 1024) return toast.error('Rasm 5 MB dan oshmasin');
    // preview + "add to highlights" choice happens in StoryUpload
    setPendingFile(file);
  };

  const deleteStory = async () => {
    if (!story || deleting) return;
    if (!window.confirm('Ushbu istoriyani o‘chirmoqchimisiz?')) return;
    setDeleting(true);
    try {
      await api.delete(`/stories/${story._id}`);
      toast.success('Istoriya o‘chirildi');
      setActiveGroup(null);
      await onChange();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const open = (item) => {
    setActiveGroup(item.user._id);
    setStoryIndex(Math.max(0, item.stories.findIndex((entry) => !entry.viewed)));
    setProgressKey((key) => key + 1);
  };

  return (
    <>
      <div className="mb-2 mt-2 flex gap-4 overflow-x-auto px-4 py-5 [scrollbar-width:none] sm:mt-6 sm:rounded-2xl sm:border sm:border-base-300 sm:bg-base-100 sm:shadow-sm" aria-label="Istoriyalar">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" aria-label="Istoriya uchun rasm" onChange={upload} />
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="flex w-16 shrink-0 flex-col items-center gap-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
            {currentUser?.avatar ? <img src={imageUrl(currentUser.avatar)} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="text-lg font-semibold uppercase">{currentUser?.username?.[0] || '+'}</span>}
            <span className="absolute bottom-0 right-0 rounded-full border-2 border-base-100 bg-primary p-0.5 text-primary-content"><FiPlus size={13} /></span>
          </span>
          <span className="w-full truncate text-center text-xs font-medium text-base-content/70">{uploading ? 'Yuklanmoqda' : 'Istoriyangiz'}</span>
        </button>
        {groups.map((item) => (
          <button key={item.user._id} type="button" onClick={() => open(item)} className="flex w-16 shrink-0 flex-col items-center gap-1 rounded-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={`${item.user.username} istoriyalari`}>
            <span className={`rounded-full p-[2px] ${item.allViewed ? 'bg-base-300' : 'bg-gradient-to-tr from-warning via-secondary to-primary'}`}>
              {item.user.avatar ? <img src={imageUrl(item.user.avatar)} alt="" className="h-14 w-14 rounded-full border-2 border-base-100 object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-base-100 bg-base-200 font-semibold uppercase">{item.user.username?.[0]}</span>}
            </span>
            <span className="w-full truncate text-center text-xs">{sameId(item.user._id, currentUser?._id) ? 'Siz' : item.user.username}</span>
          </button>
        ))}
      </div>

      {pendingFile && (
        <StoryUpload
          file={pendingFile}
          onClose={() => setPendingFile(null)}
          onDone={async () => {
            setPendingFile(null);
            setUploading(true);
            await onChange();
            setUploading(false);
          }}
        />
      )}

      {story && (
        <div role="dialog" aria-modal="true" aria-label={`${group.user.username} istoriyasi`} className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-black/95 sm:px-2 sm:py-4">
          <style>{'@keyframes story-progress { from { width: 0; } to { width: 100%; } }'}</style>
          <div className="relative flex h-full max-h-[850px] w-full max-w-[430px] flex-col overflow-hidden bg-neutral text-neutral-content sm:rounded-xl">
            <img src={imageUrl(story.image)} alt={`${group.user.username} istoriyasi`} className="absolute inset-0 h-full w-full object-contain" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-20 top-24 flex">
              <button type="button" onClick={previous} aria-label="Oldingi istoriya" className="w-1/3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" />
              <button type="button" onClick={next} aria-label="Keyingi istoriya" className="flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" />
            </div>
            <div className="relative z-10 bg-gradient-to-b from-black/70 to-transparent p-3">
              <div className="mb-3 flex gap-1">
                {group.stories.map((item, index) => <div key={item._id} className="h-0.5 flex-1 overflow-hidden rounded bg-white/40"><span key={index === storyIndex ? progressKey : undefined} className={`block h-full bg-white ${index < storyIndex ? 'w-full' : index === storyIndex ? 'animate-[story-progress_5s_linear_forwards]' : 'w-0'}`} /></div>)}
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${group.user.username}`} onClick={close} className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
                  {group.user.avatar ? <img src={imageUrl(group.user.avatar)} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-base-300 text-base-content uppercase">{group.user.username[0]}</span>}
                  <span className="truncate">{group.user.username}</span>
                  {story.demo && <span className="text-xs font-normal">Namuna</span>}
                </Link>
                {isOwnStory && <span className="text-xs">{story.viewersCount || 0} ko‘rish</span>}
                {isOwnStory && <button type="button" onClick={deleteStory} disabled={deleting} aria-label="Istoriyani o‘chirish" className="rounded-full p-2 hover:bg-white/20"><FiTrash2 /></button>}
                <button type="button" onClick={close} aria-label="Yopish" className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><FiX size={22} /></button>
              </div>
            </div>
            {story.type === 'repost' && story.post?.author && <Link to={`/profile/${story.post.author.username}`} onClick={close} className="relative z-10 mx-auto mt-auto mb-20 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold">@{story.post.author.username} postini ulashdi</Link>}
            <div className="relative z-10 mt-auto flex justify-between p-3">
              <button type="button" onClick={previous} aria-label="Oldingi istoriya" className="rounded-full bg-black/50 p-2"><FiChevronLeft size={24} /></button>
              <button type="button" onClick={next} aria-label="Keyingi istoriya" className="rounded-full bg-black/50 p-2"><FiChevronRight size={24} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesBar;
