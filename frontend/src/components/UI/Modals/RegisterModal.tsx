import RegisterForm from '../Auth/Forms/RegisterForm';
import Header from '../Auth/Header';
import SocialsMinimized from '../Auth/SocialsMinimized';
import BaseModal from './BaseModal';

const RegisterModal = () => {
	const show = false;

	return (
		<BaseModal onShow={show}>
			<Header title='Hello, register your information' />
			<RegisterForm />
			<SocialsMinimized />
		</BaseModal>
	);
};

export default RegisterModal;
