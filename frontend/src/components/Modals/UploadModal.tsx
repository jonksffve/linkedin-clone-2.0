import BaseModal from './BaseModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback } from 'react';
import { uiActions } from '@/store/slices/ui-slice';
import PostForm from '../Feed/Forms/PostForm';

const UploadModal = () => {
	const uiState = useAppSelector((state) => state.ui);
	const dispatch = useAppDispatch();

	const handleClose = useCallback(() => {
		dispatch(uiActions.onCloseUploadModal());
	}, [dispatch]);

	return (
		<BaseModal
			onShow={uiState.showUploadModal}
			disabled={false}
			onClose={handleClose}
		>
			<p className='font-bold'>Create a post!</p>
			<PostForm />
		</BaseModal>
	);
};

export default UploadModal;
