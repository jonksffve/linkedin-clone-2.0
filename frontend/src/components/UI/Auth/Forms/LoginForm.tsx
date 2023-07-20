import { BsKey } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import Input from '../../HTMLelements/Inputs/Input';
import { IconType } from 'react-icons';
import Button from '../../HTMLelements/Buttons/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginFormInputs } from '../../../../helpers/types';
import { useCallback } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { uiActions } from '../../../../store/slices/ui-slice';

/**
 * Renders a Form used to login
 */
const LoginForm = () => {
	const dispatch = useAppDispatch();

	const showRegisterHandler = useCallback(() => {
		dispatch(uiActions.onCloseLoginModal());
		dispatch(uiActions.onShowRegisterModal());
	}, [dispatch]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>({
		defaultValues: {
			email: undefined,
			password: undefined,
		},
	});

	const onSubmit: SubmitHandler<LoginFormInputs> = useCallback((data) => {
		console.log(data);
	}, []);

	return (
		<form
			autoComplete='off'
			className='flex flex-col gap-4'
			onSubmit={(event) => void handleSubmit(onSubmit)(event)}
		>
			<Input
				labelText='Email'
				id='email'
				placeholder='Enter your email'
				icon={AiOutlineMail as IconType}
				errors={errors.email}
				{...register('email', { required: true })}
			/>
			<Input
				labelText='Password'
				id='password'
				type='password'
				placeholder='Enter your password'
				icon={BsKey as IconType}
				errors={errors.password}
				{...register('password', { required: true })}
			/>
			<div className='flex flex-col md:flex-row items-center justify-end'>
				<Button
					type='submit'
					className='border-black w-1/4'
				>
					Login
				</Button>
			</div>
			<div className='flex flex-row justify-center items-center gap-2'>
				<p>New to LinkedIn?</p>
				<p
					className='hover:cursor-pointer'
					onClick={showRegisterHandler}
				>
					Register
				</p>
			</div>
		</form>
	);
};

export default LoginForm;
