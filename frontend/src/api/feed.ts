import {
	ENDPOINT_POST_LIKE,
	ENDPOINT_POST,
	ENDPOINT_COMMENT,
} from '@/helpers/routes';
import { toastConfig } from '@/helpers/toastifyConfig';
import { CommentFormInput, CreatePostFormInputs, Post } from '@/helpers/types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UseFormReset } from 'react-hook-form';
import { uiActions } from '@/store/slices/ui-slice';
import { Dispatch } from '@reduxjs/toolkit';

//* GET REQUESTS
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

export const getComments = async (
	token: string,
	postId: string,
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) => {
	try {
		const response = await axios.get(`${ENDPOINT_COMMENT}?post_id=${postId}`, {
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		setComments(response.data as Comment[]);
	} catch (error) {
		toast.error('Could not fetch comments.', toastConfig);
	}
};

//* POST REQUESTS
export const createPost = async (
	token: string,
	data: CreatePostFormInputs,
	setIsLoading: (val: boolean) => void,
	onAction: React.Dispatch<React.SetStateAction<Post[]>>,
	reset: UseFormReset<CreatePostFormInputs>,
	dispatch: Dispatch
) => {
	try {
		setIsLoading(true);
		const response = await axios.post(ENDPOINT_POST, data, {
			headers: {
				Authorization: `Token ${token}`,
				'Content-Type': 'multipart/form-data',
			},
		});
		const new_post = response.data as Post;
		onAction((prevState: Post[]) => [new_post, ...prevState]);
		reset();
		dispatch(uiActions.onCloseUploadModal());
	} catch (error) {
		toast.error('Something happened', toastConfig);
	} finally {
		setIsLoading(false);
	}
};

export const createComment = async (
	token: string,
	post: string,
	data: CommentFormInput
) => {
	try {
		await axios.post(
			ENDPOINT_COMMENT,
			{
				post,
				content: data['content'],
			},
			{
				headers: {
					Authorization: `Token ${token}`,
				},
			}
		);
	} catch (error) {
		toast.error('Could not create comment', toastConfig);
	}
};

//* DYNAMIC REQUESTS
export const togglePostLike = async (
	token: string,
	isLiked: boolean,
	setIsLiked: (val: boolean) => void,
	postId: string
) => {
	try {
		if (isLiked) {
			await axios.delete(`${ENDPOINT_POST_LIKE}${postId}/`, {
				headers: {
					Authorization: `Token ${token}`,
				},
			});
		} else {
			await axios.post(
				ENDPOINT_POST_LIKE,
				{
					post: postId,
				},
				{
					headers: {
						Authorization: `Token ${token}`,
					},
				}
			);
		}
	} catch (error) {
		toast.error('Something happened', toastConfig);
	} finally {
		setIsLiked(!isLiked);
	}
};
