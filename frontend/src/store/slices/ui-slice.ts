import { createSlice } from '@reduxjs/toolkit';

interface UiState {
	showRegisterModal: boolean;
	showLoginModal: boolean;
	showUploadModal: boolean;
}

const initialState: UiState = {
	showRegisterModal: false,
	showLoginModal: false,
	showUploadModal: false,
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
		onShowLoginModal: (state) => {
			state.showLoginModal = true;
		},
		onCloseLoginModal: (state) => {
			state.showLoginModal = false;
		},
		onShowUploadModal: (state) => {
			state.showUploadModal = true;
		},
		onCloseUploadModal: (state) => {
			state.showUploadModal = false;
		},
	},
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
