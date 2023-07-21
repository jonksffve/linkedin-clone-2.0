import { AiOutlineClose, AiOutlineLike } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import Button from './HTMLelements/Buttons/Button';
import { GoComment } from 'react-icons/go';
import { PiShareFat } from 'react-icons/pi';
import { FaUserFriends } from 'react-icons/fa';
import PlaceholderImg from '@assets/a nerdy boy is programming at a computer.jpg';

const CardContainer = () => {
	return (
		<div className='bg-white rounded-sm p-4 relative flex flex-col gap-4 my-4'>
			<div className='flex flex-row gap-2 items-center absolute right-5 text-neutral-600'>
				<Button className='hover:rounded-full p-1'>
					<BsThreeDots size={18} />
				</Button>
				<Button className='hover:rounded-full p-1'>
					<AiOutlineClose size={18} />
				</Button>
			</div>
			<div>
				<h2 className='font-semibold'>Username</h2>
				<div className='flex flex-row text-neutral-400 items-center gap-1'>
					<p className='text-sm '>Time</p>
					<p>•</p>
					<FaUserFriends />
				</div>
			</div>
			<div className='border border-neutral-300 rounded-md p-2 flex flex-col gap-2'>
				<img
					className='min-h-[450px] max-h-[450px] w-full object-contain'
					src={PlaceholderImg}
					alt=''
				/>
				<hr />
				<div>Post information</div>
			</div>
			<div className='w-full flex flex-row justify-between text-neutral-500 font-medium'>
				<Button className='w-full rounded-none'>
					Like
					<AiOutlineLike
						className='absolute left-5'
						size={20}
					/>
				</Button>
				<Button className='w-full rounded-none'>
					Comment{' '}
					<GoComment
						className='absolute left-5'
						size={20}
					/>
				</Button>
				<Button className='w-full rounded-none'>
					Share
					<PiShareFat
						className='absolute left-5'
						size={20}
					/>
				</Button>
			</div>
		</div>
	);
};

export default CardContainer;
