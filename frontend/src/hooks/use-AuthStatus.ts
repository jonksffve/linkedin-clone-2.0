import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { uiActions } from '../store/slices/ui-slice';
import { ROUTE_INDEX } from '../helpers/routes';
import { useEffect, useCallback } from 'react';
import { getUserInformationAPI } from '../api/auth';
import { userActions } from '../store/slices/user-slice';
import { UserResponse } from '../helpers/types';
import { toastConfig } from '../helpers/toastifyConfig';
import { toast } from 'react-toastify';

/**
 * Custom hook that checks if the user is logged in, otherwise it redirects you to index page and opens the modal
 */
const UseAuthStatus = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const userToken = localStorage.getItem('auth_token');

		if (!userToken) {
			navigate(ROUTE_INDEX);
			dispatch(uiActions.onShowLoginModal());
			return;
		}

		getUserInformationAPI(userToken)
			.then((response) => {
				const user = response?.data as UserResponse;
				dispatch(
					userActions.setUser({
						token: userToken,
						...user,
						logged: false,
					})
				);
			})
			.catch((err) => {
				dispatch(userActions.removeUser());
				localStorage.removeItem('auth_token');
				toast.error('Invalid token provided. Log in again.', toastConfig);
			});
	}, [dispatch, navigate]);
};

export default UseAuthStatus;
