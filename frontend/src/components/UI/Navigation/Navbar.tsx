import { Link } from 'react-router-dom';
import LogoIcon from '../../../assets/linkedin-logo-icon.png';
import NavbarIcons from './NavbarIcons';
import SearchBar from './SearchBar';
import { ROUTE_HOME } from '../../../helpers/routes';
import UserMenu from './UserMenu';
import Button from '../HTMLelements/Buttons/Button';
import { useCallback } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { uiActions } from '../../../store/slices/ui-slice';

const Navbar = () => {
	const logged = false;
	const dispatch = useAppDispatch();

	const handleRegister = useCallback(() => {
		dispatch(uiActions.onShowRegisterModal());
	}, [dispatch]);

	return (
		<div className='px-4 py-2 bg-slate-50 shadow-md'>
			<nav className='flex flex-row items-center gap-4'>
				<Link to={ROUTE_HOME}>
					<img
						className='w-[40px] h-[40px]'
						src={LogoIcon}
						alt=''
					/>
				</Link>
				{logged && (
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
				{!logged && (
					<div className='ms-auto flex flex-row gap-2'>
						<Button onClick={handleRegister}>Register</Button>
						<Button className='border-black'>Login</Button>
					</div>
				)}
			</nav>
		</div>
	);
};

export default Navbar;
