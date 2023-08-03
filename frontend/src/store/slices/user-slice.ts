import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserState } from '@/helpers/types';

const initialState: UserState = {
	token: undefined,
	id: undefined,
	first_name: '',
	last_name: '',
	email: '',
	avatar: '',
	banner: '',
	title: '',
	description: '',
	name: '',
	followers: 0,
	following: 0,
	posts: 0,
	logged: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserState>) => {
			state.token = action.payload.token;
			state.id = action.payload.id;
			state.first_name = action.payload.first_name;
			state.last_name = action.payload.last_name;
			state.email = action.payload.email;
			state.avatar = action.payload.avatar;
			state.banner = action.payload.banner;
			state.title = action.payload.title;
			state.description = action.payload.description;
			state.name = action.payload.name;
			state.followers = action.payload.followers;
			state.following = action.payload.following;
			state.posts = action.payload.posts;
			state.logged = true;
		},
		removeUser: (state) => {
			state.token = undefined;
			state.id = undefined;
			state.first_name = '';
			state.last_name = '';
			state.email = '';
			state.avatar = '';
			state.banner = '';
			state.title = '';
			state.description = '';
			state.name = '';
			state.followers = 0;
			state.following = 0;
			state.posts = 0;
			state.logged = false;
		},
	},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
