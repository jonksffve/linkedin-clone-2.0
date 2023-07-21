import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserState } from '@/helpers/types';

const initialState: UserState = {
	token: undefined,
	name: undefined,
	avatar: undefined,
	id: undefined,
	logged: undefined,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserState>) => {
			const { id, token, name, avatar, email } = action.payload;
			state.token = token;
			state.name = name;
			state.avatar = avatar;
			state.id = id;
			state.logged = true;
		},
		removeUser: (state) => {
			state.token = undefined;
			state.name = undefined;
			state.avatar = undefined;
			state.id = undefined;
			state.logged = false;
		},
	},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
