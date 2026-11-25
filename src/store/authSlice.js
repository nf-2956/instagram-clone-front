import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registeredUsers: [],
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const email = action.payload.user.email.trim().toLowerCase();
      state.user = state.registeredUsers.find((profile) => profile.email?.toLowerCase() === email)
        ?? action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    registerSuccess(state, action) {
      const profile = action.payload.user;
      state.registeredUsers = state.registeredUsers.filter((entry) => {
        const username = typeof entry === 'string' ? entry : entry.username;
        return username.toLowerCase() !== profile.username.toLowerCase()
          && entry.email?.toLowerCase() !== profile.email.toLowerCase();
      });
      state.registeredUsers.push(profile);
      state.user = profile;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      return { ...initialState, registeredUsers: state.registeredUsers };
    },
  },
});

export const { loginSuccess, logout, registerSuccess } = authSlice.actions;

export default authSlice.reducer;
