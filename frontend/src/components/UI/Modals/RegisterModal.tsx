import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { uiActions } from '../../../store/slices/ui-slice';
import RegisterForm from '../Auth/Forms/RegisterForm';
import Header from '../Auth/Header';
import SocialsMinimized from '../Auth/SocialsMinimized';
import BaseModal from './BaseModal';
import { useCallback } from 'react';

const RegisterModal = () => {
	const uiState = useAppSelector((state) => state.ui);
	const dispatch = useAppDispatch();

	const handleClose = useCallback(() => {
		dispatch(uiActions.onCloseRegisterModal());
	}, [dispatch]);

	return (
		<BaseModal
			onShow={uiState.showRegisterModal}
			onClose={handleClose}
		>
			<Header title='Hello, register your information' />
			<RegisterForm />
			<SocialsMinimized />
		</BaseModal>
	);
};

export default RegisterModal;
