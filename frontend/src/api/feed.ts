import { ENDPOINT_GET_POSTS } from '@/helpers/routes';
import { toastConfig } from '@/helpers/toastifyConfig';
import { Post } from '@/helpers/types';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getPosts = async (
	token: string,
	setData: (val: Post[]) => void,
	setIsLoading: (val: boolean) => void
) => {
	try {
		setIsLoading(true);
		const response = await axios.get(ENDPOINT_GET_POSTS, {
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
