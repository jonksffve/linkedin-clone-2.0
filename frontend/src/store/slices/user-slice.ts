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
    university: '',
    actual_work: '',
    location: '',
    name: '',
    get_followers: 0,
    get_following: 0,
    get_posts: 0,
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
            state.university = action.payload.university;
            state.actual_work = action.payload.actual_work;
            state.location = action.payload.location;
            state.name = action.payload.name;
            state.get_followers = action.payload.get_followers;
            state.get_following = action.payload.get_following;
            state.get_posts = action.payload.get_posts;
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
            state.university = '';
            state.actual_work = '';
            state.location = '';
            state.name = '';
            state.get_followers = 0;
            state.get_following = 0;
            state.get_posts = 0;
            state.logged = false;
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
