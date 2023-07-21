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

	const clearAllData = useCallback(() => {
		navigate(ROUTE_INDEX);
		dispatch(uiActions.onShowLoginModal());
		dispatch(userActions.removeUser());
		localStorage.removeItem('auth_token');
	}, [dispatch, navigate]);

	useEffect(() => {
		const userToken = localStorage.getItem('auth_token');

		if (!userToken) {
			clearAllData();
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
				clearAllData();
				toast.error('Invalid token provided. Log in again.', toastConfig);
			});
	}, [dispatch, navigate, clearAllData]);
};

export default UseAuthStatus;
