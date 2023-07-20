import { Outlet } from 'react-router-dom';
import Navbar from '../../components/UI/Navigation/Navbar';
import RegisterModal from '../../components/UI/Modals/RegisterModal';
import LoginModal from '../../components/UI/Modals/LoginModal';

const RootLayout = () => {
	return (
		<div className='flex flex-col h-full'>
			<Navbar />
			<main className='p-4 bg-neutral-100 h-full flex-1 overflow-y-auto'>
				<Outlet />
			</main>
			<RegisterModal />
			<LoginModal />
		</div>
	);
};

export default RootLayout;
