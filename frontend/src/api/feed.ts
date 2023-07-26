import { ENDPOINT_POST } from '@/helpers/routes';
import { toastConfig } from '@/helpers/toastifyConfig';
import { CreatePostFormInputs, Post } from '@/helpers/types';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getPosts = async (
	token: string,
	setData: (val: Post[]) => void,
	setIsLoading: (val: boolean) => void
) => {
	try {
		setIsLoading(true);
		const response = await axios.get(ENDPOINT_POST, {
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		setData(response.data as Post[]);
	} catch (error) {
		toast.error('Something happened fetching data', toastConfig);
	} finally {
		setIsLoading(false);
	}
};

export const createPost = async (token: string, data: CreatePostFormInputs) => {
	try {
		await axios.post(ENDPOINT_POST, data, {
			headers: {
				Authorization: `Token ${token}`,
				'Content-Type': 'multipart/form-data',
			},
		});
	} catch (error) {
		console.log(error);
		toast.error('Something happened', toastConfig);
	}
};
