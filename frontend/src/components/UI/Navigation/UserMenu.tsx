import { FaUserCircle } from 'react-icons/fa';
import { BiLogOut, BiSolidDownArrow } from 'react-icons/bi';
import { useCallback, useState } from 'react';
import MenuCard from './MenuCard';

const UserMenu = () => {
	const [showMenu, setShowMenu] = useState(false);

	const handleToggleMenu = useCallback(() => {
		setShowMenu(!showMenu);
	}, [showMenu]);

	const handleClick = useCallback(() => {
		setShowMenu(false);
	}, []);

	return (
		<>
			<div
				className='flex flex-col text-neutral-600 cursor-pointer relative'
				onClick={handleToggleMenu}
			>
				<FaUserCircle size={24} />
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
										src=''
										alt=''
									/>
								</div>
								<div>
									<h2>Username</h2>
									<p className='text-sm'>Title</p>
								</div>
							</div>
							<button className='rounded-full border border-blue-300 hover:bg-blue-100 text-blue-500 font-bold text-sm p-1'>
								View profile
							</button>
							<hr />
							<div>
								<p>Menu item</p>
								<p>Menu item</p>
								<p>Menu item</p>
							</div>
							<hr />
							<div>
								<button className='rounded-full border border-transparent hover:border-black w-full relative flex flex-row items-center justify-center'>
									<div className='absolute left-2'>
										<BiLogOut size={20} />
									</div>
									Logout
								</button>
							</div>
						</div>
					</MenuCard>
				)}
			</div>
		</>
	);
};

export default UserMenu;
