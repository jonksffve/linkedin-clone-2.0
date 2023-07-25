import { useAppSelector } from '@/store/hooks';
import Input from '../HTMLelements/Inputs/Input';
import { LiaCommentDotsSolid } from 'react-icons/lia';
import { BsSend } from 'react-icons/bs';
import { IconType } from 'react-icons';

const CommentBox = () => {
	const userState = useAppSelector((state) => state.user);
	return (
		<div className='p-2 flex flex-row gap-2 relative items-center'>
			<div>
				<img
					className='w-[32px] h-[32px] border border-neutral-200 rounded-full'
					src={userState.avatar}
					alt=''
				/>
			</div>
			<div className='w-full border border-neutral-200 rounded-md bg-slate-100'>
				<Input
					placeholder='Enter your comment...'
					icon={LiaCommentDotsSolid as IconType}
				/>
			</div>
			<button className='absolute right-5 text-neutral-400 hover:text-black'>
				<BsSend />
			</button>
		</div>
	);
};

export default CommentBox;
