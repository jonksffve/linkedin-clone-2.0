import { Link } from 'react-router-dom';
import { ROUTE_FEED } from '../helpers/routes';
import { IoIosArrowBack } from 'react-icons/io';

const ErrorPage = () => {
	return (
		<div className='flex flex-col justify-center items-center h-full'>
			<div className='text-pink-800 font-bold text-4xl'>Opps!</div>
			<h2 className='font-bold'>Something happened!</h2>
			<p className='mt-4'>
				Server responded with an{' '}
				<span className='text-rose-600 font-bold'>error</span>, better be safe
			</p>
			<Link to={ROUTE_FEED}>
				<button className='flex flex-row items-center hover:bg-neutral-400 rounded-full p-3 mt-2 border border-black'>
					<IoIosArrowBack />
					<p>Get back home!</p>
				</button>
			</Link>
		</div>
	);
};

export default ErrorPage;
