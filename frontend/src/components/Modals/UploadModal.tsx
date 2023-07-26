import BaseModal from './BaseModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback } from 'react';
import { uiActions } from '@/store/slices/ui-slice';
import PostForm from '../Feed/Forms/PostForm';
import { Post } from '@/helpers/types';

interface UploadModalProps {
	onAction: React.Dispatch<React.SetStateAction<Post[]>>;
}

const UploadModal: React.FC<UploadModalProps> = ({ onAction }) => {
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
			<p className='font-bold mb-4'>Create a post!</p>
			<PostForm onAction={onAction} />
		</BaseModal>
	);
};

export default UploadModal;
