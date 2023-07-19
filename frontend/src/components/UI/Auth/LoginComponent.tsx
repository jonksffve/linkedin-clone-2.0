import LoginForm from './Forms/LoginForm';
import Header from './Header';
import Socials from './Socials';

const LoginComponent = () => {
	return (
		<div className='p-4 rounded-md w-full'>
			<Header title='Login information' />
			<LoginForm />
			<Socials />
		</div>
	);
};

export default LoginComponent;
