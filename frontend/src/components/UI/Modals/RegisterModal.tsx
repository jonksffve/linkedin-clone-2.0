import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { uiActions } from '../../../store/slices/ui-slice';
import RegisterForm from '../Auth/Forms/RegisterForm';
import Header from '../Auth/Header';
import SocialsMinimized from '../Auth/SocialsMinimized';
import BaseModal from './BaseModal';
import { useCallback, useState } from 'react';

/**
 * Renders a modal with a RegisterForm for registration
 */
const RegisterModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const uiState = useAppSelector((state) => state.ui);
	const dispatch = useAppDispatch();

	const handleClose = useCallback(() => {
		dispatch(uiActions.onCloseRegisterModal());
	}, [dispatch]);

	return (
		<BaseModal
			onShow={uiState.showRegisterModal}
			onClose={handleClose}
			disabled={isLoading}
		>
			<Header title='Hello, register your information' />
			<RegisterForm onSubmit={setIsLoading} />
			<SocialsMinimized />
		</BaseModal>
	);
};

export default RegisterModal;
