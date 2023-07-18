import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';

interface NavbarIconProps {
	title: string;
	hrefTo: string;
	icon: IconType;
}

const NavbarIcon: React.FC<NavbarIconProps> = ({
	title,
	hrefTo,
	icon: Icon,
}) => {
	const baseClass =
		'flex flex-col justify-center items-center cursor-pointer text-neutral-500 hover:text-black min-w-[70px] border-b-2 border-transparent';

	return (
		<NavLink
			to={hrefTo}
			className={({ isActive }) =>
				isActive ? `${baseClass} border-black text-black` : baseClass
			}
		>
			<Icon size={30} />
			<p className='text-xs'>{title}</p>
		</NavLink>
	);
};

export default NavbarIcon;
