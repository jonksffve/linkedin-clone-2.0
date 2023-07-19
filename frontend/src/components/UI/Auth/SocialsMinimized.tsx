import { FcGoogle } from 'react-icons/fc';
import Divider from '../Divider';
import { FaFacebookF } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';

const SocialsMinimized = () => {
	return (
		<>
			<Divider />
			<div className='flex flex-col items-center gap-4'>
				<p className='self-center'>Use your favorite social network</p>
				<div className='flex flew-row gap-4 justify-center'>
					<FcGoogle
						size={24}
						className='rounded-full cursor-pointer'
					/>
					<FaFacebookF
						size={24}
						className='rounded-full cursor-pointer'
					/>
					<FiGithub
						size={24}
						className='rounded-full cursor-pointer'
					/>
				</div>
			</div>
		</>
	);
};

export default SocialsMinimized;
