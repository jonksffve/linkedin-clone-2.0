import { createSlice } from '@reduxjs/toolkit';

interface UiState {
	showRegisterModal: boolean;
}

const initialState: UiState = {
	showRegisterModal: false,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		onShowRegisterModal: (state) => {
			state.showRegisterModal = true;
		},
		onCloseRegisterModal: (state) => {
			state.showRegisterModal = false;
		},
	},
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
