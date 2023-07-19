import { Link } from 'react-router-dom';
import LogoIcon from '../../../assets/linkedin-logo-icon.png';
import NavbarIcons from './NavbarIcons';
import SearchBar from './SearchBar';
import { ROUTE_HOME } from '../../../helpers/routes';
import UserMenu from './UserMenu';

const Navbar = () => {
	const logged = false;

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
						<button className='border border-transparent px-4 rounded-full hover:bg-neutral-200 leading-10'>
							Sign up
						</button>
						<button className='border rounded-full px-6 border-blue-600 hover:bg-blue-200 text-blue-500 leading-10'>
							Login
						</button>
					</div>
				)}
			</nav>
		</div>
	);
};

export default Navbar;
