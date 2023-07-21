import { useAppSelector } from '@/store/hooks';
import Button from '../UI/HTMLelements/Buttons/Button';
import { BsCalendarEvent, BsFileImage } from 'react-icons/bs';
import { TfiCommentAlt } from 'react-icons/tfi';

const PostCreation = () => {
	const userState = useAppSelector((state) => state.user);

	return (
		<div className='bg-white rounded-sm p-2 flex flex-col gap-2'>
			<div className='flex flex-row gap-2'>
				<img
					className='h-[40px] w-[40px] rounded-full'
					src={userState.avatar}
					alt=''
				/>
				<Button className='w-full hover:bg-neutral-200 bg-blue-50'>
					<span className='absolute left-5 text-neutral-400'>
						{userState.name}, what are you thinking?
					</span>
				</Button>
			</div>
			<hr />
			<div className='w-full flex flex-row'>
				<Button className='w-full hover:bg-neutral-100 text-neutral-400 rounded-sm font-semibold font-sans'>
					Foto/Video
					<BsFileImage className='absolute left-5' />
				</Button>
				<Button className='w-full hover:bg-neutral-100 text-neutral-400 rounded-sm font-semibold font-sans'>
					Post
					<TfiCommentAlt className='absolute left-5' />
				</Button>
				<Button className='w-full hover:bg-neutral-100 text-neutral-400 rounded-sm font-semibold font-sans'>
					Evento
					<BsCalendarEvent className='absolute left-5' />
				</Button>
			</div>
		</div>
	);
};

export default PostCreation;
