import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { uiActions } from '../store/slices/ui-slice';
import { ROUTE_INDEX } from '../helpers/routes';
import { useEffect } from 'react';

/**
 * Custom hook that checks if the user is logged in, otherwise it redirects you to index page and opens the modal
 */
const UseAuthStatus = () => {
	const userState = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!userState.logged) {
			navigate(ROUTE_INDEX);
			dispatch(uiActions.onShowLoginModal());
			return;
		}
	}, [dispatch, navigate, userState.logged]);
};

export default UseAuthStatus;
