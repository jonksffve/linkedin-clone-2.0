import { ENDPOINT_PROFILE_EDIT } from '@/helpers/routes';
import { toastConfig } from '@/helpers/toastifyConfig';
import { UpdateAvatarResponse, UserUpdateForm } from '@/helpers/types';
import axios from 'axios';
import { toast } from 'react-toastify';

export const updateUserAPI = async (token: string, data: UserUpdateForm) => {
	try {
		await axios.patch(ENDPOINT_PROFILE_EDIT, data, {
			headers: { Authorization: `Token ${token}` },
		});
		toast.success('User information updated.', toastConfig);
	} catch (error) {
		toast.error('Could not update user information.', toastConfig);
	}
};

export const updateUserImageAPI = async (image: File, token: string, type: string) => {
	try {
		const url = `${ENDPOINT_PROFILE_EDIT}${type}/`;
		const data = {
			[type]: image,
		};
		const response = await axios.patch(url, data, {
			headers: {
				Authorization: `Token ${token}`,
				'Content-Type': 'multipart/form-data',
			},
		});
		toast.success(`User ${type} updated.`, toastConfig);
		return response.data as UpdateAvatarResponse;
	} catch (error) {
		toast.error(`Could not update ${type} picture.`, toastConfig);
		throw error;
	}
};
