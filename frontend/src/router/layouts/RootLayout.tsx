import { Outlet } from 'react-router-dom';
import Navbar from '../../components/UI/Navigation/Navbar';
import RegisterModal from '../../components/UI/Modals/RegisterModal';

const RootLayout = () => {
	return (
		<div className='flex flex-col h-full'>
			<Navbar />
			<main className='p-4 bg-neutral-100 h-full flex-1 overflow-y-auto'>
				<Outlet />
			</main>
			<RegisterModal />
		</div>
	);
};

export default RootLayout;
