import { ENDPOINT_PROFILE_EDIT } from '@/helpers/routes';
import { toastConfig } from '@/helpers/toastifyConfig';
import { UserUpdateForm } from '@/helpers/types';
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

export const updateAvatarAPI = async (image: File, token: string) => {
    try {
        console.log(image, token);
        await axios.patch('123', {});
    } catch (error) {
        toast.error('Could not update avatar picture', toastConfig);
    }
};
