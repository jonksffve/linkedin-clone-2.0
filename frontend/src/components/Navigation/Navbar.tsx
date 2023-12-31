import { Link } from 'react-router-dom';
import LogoIcon from '@assets/linkedin-logo-icon.png';
import NavbarIcons from './NavbarIcons';
import SearchBar from './SearchBar';
import { ROUTE_FEED } from '@/helpers/routes';
import UserMenu from './UserMenu';
import Button from '../HTMLelements/Buttons/Button';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uiActions } from '@/store/slices/ui-slice';

/**
 * Top navigation bar component
 */
const Navbar = () => {
	const userState = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	const handleClickRegister = useCallback(() => {
		dispatch(uiActions.onShowRegisterModal());
	}, [dispatch]);

	const handleClickLogin = useCallback(() => {
		dispatch(uiActions.onShowLoginModal());
	}, [dispatch]);

	return (
		<div className='px-4 py-2 bg-slate-50 shadow-md'>
			<nav className='flex flex-row items-center gap-4'>
				<Link to={ROUTE_FEED}>
					<img
						className='w-[40px] h-[40px]'
						src={LogoIcon}
						alt=''
					/>
				</Link>
				{userState.logged && (
					<>
						<div className='flex flex-row gap-4 items-center'>
							<SearchBar />
							<NavbarIcons />
						</div>
						<div className='ms-auto'>
							<UserMenu />
						</div>
					</>
				)}
				{!userState.logged && (
					<div className='ms-auto flex flex-row gap-2'>
						<Button onClick={handleClickRegister}>Register</Button>
						<Button
							className='border-black'
							onClick={handleClickLogin}
						>
							Login
						</Button>
					</div>
				)}
			</nav>
		</div>
	);
};

export default Navbar;
