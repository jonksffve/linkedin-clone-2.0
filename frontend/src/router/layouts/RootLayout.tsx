import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navigation/Navbar';
import RegisterModal from '@components/Modals/RegisterModal';
import LoginModal from '@components/Modals/LoginModal';
import useAuthStatus from '@/hooks/use-AuthStatus';
import UploadModal from '@/components/Modals/UploadModal';

const RootLayout = () => {
	useAuthStatus();

	return (
		<div className='flex flex-col h-screen'>
			<Navbar />
			<main className='p-2 bg-slate-200 h-full flex-1 overflow-y-auto'>
				<Outlet />
			</main>
			<RegisterModal />
			<LoginModal />
			<UploadModal />
		</div>
	);
};

export default RootLayout;
