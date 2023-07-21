import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import LoginForm from '../Auth/Forms/LoginForm';
import Header from '../Auth/Header';
import SocialsMinimized from '../Auth/SocialsMinimized';
import BaseModal from './BaseModal';
import { uiActions } from '../../../store/slices/ui-slice';

/**
 * Renders a modal with a LoginForm for authentication
 */
const LoginModal = () => {
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useAppDispatch();
	const uiState = useAppSelector((state) => state.ui);

	const handleClose = useCallback(() => {
		dispatch(uiActions.onCloseLoginModal());
	}, [dispatch]);

	return (
		<BaseModal
			onShow={uiState.showLoginModal}
			disabled={isLoading}
			onClose={handleClose}
		>
			<Header title='Login information' />
			<LoginForm onSubmit={setIsLoading} />
			<SocialsMinimized />
		</BaseModal>
	);
};

export default LoginModal;
