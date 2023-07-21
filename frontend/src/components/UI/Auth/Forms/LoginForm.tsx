import { BsKey } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import Input from '../../HTMLelements/Inputs/Input';
import { IconType } from 'react-icons';
import Button from '../../HTMLelements/Buttons/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginFormInputs, TokenResponse } from '@/helpers/types';
import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { uiActions } from '@/store/slices/ui-slice';
import { createTokenAuthAPI } from '@/api/auth';
import { userActions } from '@/store/slices/user-slice';
import { toast } from 'react-toastify';
import { toastConfig } from '@/helpers/toastifyConfig';

interface LoginFormProps {
	onSubmit: (value: boolean) => void;
}

/**
 * Renders a Form used to login
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
	const dispatch = useAppDispatch();

	const showRegisterHandler = useCallback(() => {
		dispatch(uiActions.onCloseLoginModal());
		dispatch(uiActions.onShowRegisterModal());
	}, [dispatch]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<LoginFormInputs>({
		defaultValues: {
			username: undefined,
			password: undefined,
		},
	});

	const submitHandler: SubmitHandler<LoginFormInputs> = useCallback(
		async (data) => {
			try {
				const response = await createTokenAuthAPI(data, onSubmit);
				const { token, user } = response?.data as TokenResponse;
				reset();
				dispatch(uiActions.onCloseLoginModal());
				dispatch(userActions.setUser({ token, ...user, logged: false }));
				localStorage.setItem('auth_token', token);
			} catch (error) {
				toast.error('Please check the given credentials.', toastConfig);
			}
		},
		[onSubmit, reset, dispatch]
	);

	return (
		<form
			autoComplete='off'
			className='flex flex-col gap-4'
			onSubmit={(event) => void handleSubmit(submitHandler)(event)}
		>
			<Input
				labelText='Email'
				id='email'
				placeholder='Enter your email'
				type='email'
				icon={AiOutlineMail as IconType}
				errors={errors.username}
				{...register('username', { required: true })}
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
