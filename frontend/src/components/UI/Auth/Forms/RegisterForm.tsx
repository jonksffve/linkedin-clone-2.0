import { useForm, SubmitHandler } from 'react-hook-form';
import { RegisterFormInputs } from '../../../../helpers/types';
import { useCallback } from 'react';
import Input from '../../HTMLelements/Inputs/Input';
import { BsKey, BsKeyboard } from 'react-icons/bs';
import { IconType } from 'react-icons';
import Button from '../../HTMLelements/Buttons/Button';
import { AiOutlineMail } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { useAppDispatch } from '../../../../store/hooks';
import { uiActions } from '../../../../store/slices/ui-slice';

/**
 * Renders a Form used to register new users
 */
const RegisterForm = () => {
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInputs>({
		defaultValues: {
			email: undefined,
			password: undefined,
			first_name: undefined,
			last_name: undefined,
			avatar: undefined,
		},
	});

	const submitHandler: SubmitHandler<RegisterFormInputs> = useCallback(
		(data) => {
			console.log(data);
		},
		[]
	);

	const showLoginHandler = useCallback(() => {
		dispatch(uiActions.onCloseRegisterModal());
		dispatch(uiActions.onShowLoginModal());
	}, [dispatch]);

	return (
		<form
			autoComplete='off'
			onSubmit={(event) => void handleSubmit(submitHandler)(event)}
			className='flex flex-col gap-4'
		>
			<Input
				labelText='Email'
				type='email'
				id='email'
				placeholder='Enter your email'
				icon={AiOutlineMail as IconType}
				errors={errors.email}
				{...register('email', { required: true })}
			/>
			<Input
				labelText='First name'
				id='first_name'
				placeholder='Enter your first name'
				icon={BsKeyboard as IconType}
				errors={errors.first_name}
				{...register('first_name', { required: true })}
			/>
			<Input
				labelText='Last name'
				id='last_name'
				placeholder='Enter your last name'
				icon={BsKeyboard as IconType}
				errors={errors.last_name}
				{...register('last_name', { required: true })}
			/>
			<Input
				labelText='Password'
				type='password'
				id='password'
				placeholder='Enter a secure password'
				icon={BsKey as IconType}
				errors={errors.password}
				{...register('password', { required: true })}
			/>
			<Input
				labelText='Avatar'
				id='avatar'
				type='file'
				icon={BiImageAdd as IconType}
				{...register('avatar', { required: true })}
			/>
			<div className='flex flex-col md:flex-row items-center justify-end'>
				<Button
					type='submit'
					className='border-black w-2/3 md:w-1/4'
				>
					Create
				</Button>
			</div>
			<div className='flex flex-row justify-center items-center gap-2'>
				<p>Already in LinkedIn?</p>
				<p
					className='hover:cursor-pointer'
					onClick={showLoginHandler}
				>
					Login
				</p>
			</div>
		</form>
	);
};

export default RegisterForm;
