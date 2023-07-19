import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';
import Button from '../HTMLelements/Buttons/Button';
import { IconType } from 'react-icons';
import Divider from '../Divider';

const Socials = () => {
	return (
		<>
			<Divider />
			<div className='flex flex-col items-center gap-4'>
				<p className='self-center'>Use your favorite social network</p>
				<Button
					icon={FcGoogle as IconType}
					className='border-black w-2/3'
				>
					Google
				</Button>
				<Button
					icon={FaFacebookF as IconType}
					className='border-black w-2/3'
				>
					Facebook
				</Button>
				<Button
					icon={FiGithub as IconType}
					className='border-black w-2/3'
				>
					GitHub
				</Button>
			</div>
		</>
	);
};

export default Socials;
