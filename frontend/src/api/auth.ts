import { toast } from 'react-toastify';
import { toastConfig } from '@/helpers/toastifyConfig';
import {
	ErrorResponse,
	LoginFormInputs,
	RegisterFormInputs,
} from '@/helpers/types';
import axios from 'axios';
import {
	ENDPOINT_ACCOUNT,
	ENDPOINT_LOGIN,
	ENDPOINT_LOGOUT,
	ENDPOINT_PROFILE,
} from '@/helpers/routes';
import { UseFormReset, UseFormSetError } from 'react-hook-form';

export const createUserAPI = async (
	data: RegisterFormInputs,
	setIsLoading: (value: boolean) => void,
	setError: UseFormSetError<RegisterFormInputs>,
	reset: UseFormReset<RegisterFormInputs>,
	showLoginHandler: () => void
) => {
	try {
		setIsLoading(true);
		await axios.post(ENDPOINT_ACCOUNT, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		reset();
		showLoginHandler();
		toast.success('Account created successfully', toastConfig);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				const data = error.response.data as ErrorResponse;

				for (const field in data) {
					setError(field, {
						type: 'custom',
						message: data[field as keyof ErrorResponse],
					});
				}
			} else {
				toast.error(
					`An unexpected error ocurred: ${error.message}`,
					toastConfig
				);
			}
		}
	} finally {
		setIsLoading(false);
	}
};

export const createTokenAuthAPI = async (
	data: LoginFormInputs,
	setIsLoading: (value: boolean) => void
) => {
	try {
		setIsLoading(true);
		const response = await axios.post(ENDPOINT_LOGIN, data);
		toast.success('Welcome back user', toastConfig);
		return response;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw error;
		} else {
			toast.error('Something unexpected happened.', toastConfig);
		}
	} finally {
		setIsLoading(false);
	}
};

export const getUserInformationAPI = async (token: string, userEmail?: string) => {
	try {
		let url = ENDPOINT_PROFILE

		if (userEmail) {
			url += `?email=${userEmail}`
		}

		const response = await axios.get(url, {
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		return response;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw error;
		}
		toast.error('Something unexpected happened.', toastConfig);
	}
};

export const logoutUserAPI = async (token: string) => {
	try {
		await axios.post(
			ENDPOINT_LOGOUT,
			{},
			{
				headers: {
					Authorization: `Token ${token}`,
				},
			}
		);
	} catch (error) {
		toast.error('Something unexpected happened.', toastConfig);
	}
};
