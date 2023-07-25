import { BiLogOut, BiSolidDownArrow } from 'react-icons/bi';
import { useCallback, useState } from 'react';
import MenuCard from './MenuCard';
import { useAppSelector } from '@/store/hooks';
import Button from '../HTMLelements/Buttons/Button';
import { logoutUserAPI } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTE_INDEX } from '@/helpers/routes';

const UserMenu = () => {
	const [showMenu, setShowMenu] = useState(false);
	const userState = useAppSelector((state) => state.user);
	const navigate = useNavigate();

	const handleToggleMenu = useCallback(() => {
		setShowMenu(!showMenu);
	}, [showMenu]);

	const handleClick = useCallback(() => {
		setShowMenu(false);
	}, []);

	const handleLogOut = useCallback(async () => {
		await logoutUserAPI(userState.token);
		localStorage.removeItem('auth_token');
		navigate(ROUTE_INDEX);
		navigate(0);
	}, [userState.token, navigate]);

	return (
		<>
			<div
				className='flex flex-col text-neutral-600 cursor-pointer relative'
				onClick={handleToggleMenu}
			>
				<img
					className='w-[30px] h-[30px] rounded-full border border-black'
					src={userState.avatar}
					alt=''
				/>
				<p className='flex text-sm items-center'>
					Yo
					<BiSolidDownArrow size={10} />
				</p>
				{showMenu && (
					<MenuCard onClickOutside={handleClick}>
						<div className='flex flex-col gap-4 cursor-default'>
							<div className='flex flex-row gap-2 items-center'>
								<div>
									<img
										className='h-[52px] w-[52px] rounded-full'
										src={userState.avatar}
										alt=''
									/>
								</div>
								<div>
									<h2 className='font-semibold truncate'>{userState.name}</h2>
									<p className='text-sm truncate'>{userState.title}</p>
								</div>
							</div>
							<Button className='border-blue-300 hover:bg-blue-100 text-blue-500 font-bold text-sm'>
								View profile
							</Button>

							<hr />
							<div>
								<p>Menu item</p>
								<p>Menu item</p>
								<p>Menu item</p>
							</div>
							<hr />
							<Button
								className='hover:border-black'
								onClick={() => {
									void handleLogOut();
								}}
							>
								Logout
								<div className='absolute left-2'>
									<BiLogOut size={20} />
								</div>
							</Button>
						</div>
					</MenuCard>
				)}
			</div>
		</>
	);
};

export default UserMenu;
