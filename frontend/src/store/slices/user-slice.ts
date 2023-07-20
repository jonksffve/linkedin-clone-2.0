import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserState {
	token: string | undefined;
	name: string | undefined;
	avatar: string | undefined;
	id: string | undefined;
	logged: boolean;
}

const initialState: UserState = {
	token: undefined,
	name: undefined,
	avatar: undefined,
	id: undefined,
	logged: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserState>) => {
			const { id, token, name, avatar } = action.payload;
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
