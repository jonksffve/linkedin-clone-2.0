import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';
import Button from '../HTMLelements/Buttons/Button';
import Divider from '../Divider';

const Socials = () => {
	return (
		<>
			<Divider />
			<div className='flex flex-col items-center gap-4'>
				<p className='self-center'>Use your favorite social network</p>
				<Button className='border-black w-2/3'>
					Google
					<FcGoogle
						className='absolute left-5'
						size={20}
					/>
				</Button>
				<Button className='border-black w-2/3'>
					Facebook
					<FaFacebookF
						className='absolute left-5'
						size={20}
					/>
				</Button>
				<Button className='border-black w-2/3'>
					GitHub
					<FiGithub
						className='absolute left-5'
						size={20}
					/>
				</Button>
			</div>
		</>
	);
};

export default Socials;
