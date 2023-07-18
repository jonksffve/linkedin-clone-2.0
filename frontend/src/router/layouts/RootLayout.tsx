import { Outlet } from 'react-router-dom';
import Navbar from '../../components/UI/Navigation/Navbar';

const RootLayout = () => {
	return (
		<div>
			<Navbar />
			<main className='p-4'>
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
