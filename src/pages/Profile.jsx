import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountAvatar from '../components/AccountAvatar';
import FollowLists from '../components/FollowLists';
import ProfileMedia from '../components/ProfileMedia';
import StoryHighlights from '../components/StoryHighlights';
import { api } from '../api/client';
import './account.css';

// Another user's profile: /profile/:username
export default function Profile() {
  const { username } = useParams();
  const me = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [followBusy, setFollowBusy] = useState(false);
  const isMe = username?.toLowerCase() === me?.username?.toLowerCase();

  useEffect(() => {
    if (isMe) return undefined;
    let ignore = false;
    setData(null);
    setError('');
    const path = `/user/${encodeURIComponent(username)}`;
    Promise.all([api.get(path), api.get(`${path}/posts`)])
      .then(([header, feed]) => { if (!ignore) setData({ profile: header.user, posts: feed.posts }); })
      .catch((err) => { if (!ignore) setError(err.message); });
    return () => { ignore = true; };
  }, [username, isMe, reload]);

  // Own profile lives on /profile
  if (isMe) return <Navigate to="/profile" replace />;

  async function toggleFollow() {
    if (followBusy) return;
    setFollowBusy(true);
    try {
      const result = await api.post(`/user/${data.profile._id}/follow`);
      setData((current) => ({ ...current, profile: { ...current.profile, ...result } }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFollowBusy(false);
    }
  }

  if (error) {
    return (
      <section className="account-page dashboard-profile">
        <p className="error" role="alert">{error}{' '}
          <button type="button" className="btn btn-xs" onClick={() => setReload((value) => value + 1)}>Qayta urinish</button>
        </p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="account-page dashboard-profile" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="skeleton h-20 w-20 shrink-0 rounded-full" />
          <div className="space-y-2"><div className="skeleton h-5 w-40" /><div className="skeleton h-4 w-24" /></div>
        </div>
        <div className="skeleton mt-6 h-16 w-full" />
      </section>
    );
  }

  const { profile, posts } = data;
  const displayName = profile.fullName || profile.username;

  return (
    <section className="account-page dashboard-profile" aria-labelledby="profile-title">
      <div className="dashboard-user">
        <div className="profile-avatar-area">
          {profile.note && <span className="profile-note-bubble"><span>{profile.note.text}</span></span>}
          <AccountAvatar user={profile} />
        </div>
        <div>
          <h1 id="profile-title">{displayName}</h1>
          <p>@{profile.username}</p>
        </div>
      </div>
      {profile.bio && <p className="profile-bio">{profile.bio}</p>}
      <FollowLists key={`${profile.username}-${profile.followersCount}`} profile={profile} />
      <div className="profile-tools">
        <button
          type="button"
          onClick={toggleFollow}
          disabled={followBusy}
          aria-pressed={profile.isFollowing}
          className={`btn btn-sm ${profile.isFollowing ? 'btn-outline' : 'btn-primary'}`}
        >
          {followBusy && <span className="loading loading-spinner loading-xs" />}
          {profile.isFollowing ? 'Kuzatilmoqda' : 'Kuzatish'}
        </button>
      </div>
      <StoryHighlights username={profile.username} />
      <ProfileMedia posts={posts} username={profile.username} isMe={false} />
    </section>
  );
}
