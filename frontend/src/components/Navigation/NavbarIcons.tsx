import { BiSolidHome } from 'react-icons/bi';
import NavbarIcon from './NavbarIcon';
import { IconType } from 'react-icons';
import { BsBriefcaseFill, BsChatDotsFill, BsPeopleFill } from 'react-icons/bs';
import { IoNotifications } from 'react-icons/io5';
import {
	ROUTE_CHAT,
	ROUTE_CONNECTIONS,
	ROUTE_FEED,
	ROUTE_JOBS,
	ROUTE_NOTIFICATIONS,
} from '../../../helpers/routes';

const NavbarIcons = () => {
	return (
		<div className='flex flex-row gap-4'>
			<NavbarIcon
				icon={BiSolidHome as IconType}
				title='Home'
				hrefTo={ROUTE_FEED}
			/>
			<NavbarIcon
				icon={BsPeopleFill as IconType}
				title='Connections'
				hrefTo={ROUTE_CONNECTIONS}
			/>
			<NavbarIcon
				icon={BsBriefcaseFill as IconType}
				title='Jobs'
				hrefTo={ROUTE_JOBS}
			/>
			<NavbarIcon
				icon={BsChatDotsFill as IconType}
				title='Chat'
				hrefTo={ROUTE_CHAT}
			/>
			<NavbarIcon
				icon={IoNotifications as IconType}
				title='Notifications'
				hrefTo={ROUTE_NOTIFICATIONS}
			/>
		</div>
	);
};

export default NavbarIcons;
