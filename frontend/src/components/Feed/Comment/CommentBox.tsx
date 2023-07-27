import { Comment } from '@/helpers/types';
import { formatDistanceToNow } from 'date-fns';

interface CommentBoxProps {
	data: Comment;
}

const CommentBox: React.FC<CommentBoxProps> = ({ data }) => {
	return (
		<>
			<div className='flex gap-2 w-full'>
				<img
					className='w-[32px] h-[32px] rounded-full border border-black'
					src={data.user.avatar}
					alt=''
				/>
				<div className='flex flex-col gap-0'>
					<div className='w-fit rounded-md p-2 bg-slate-100'>
						{data.content}
					</div>
					<div className='flex flex-row gap-3 text-sm text-neutral-500/80 font-semibold'>
						<p className='hover:cursor-pointer hover:text-neutral-600'>Like</p>
						<p className='hover:cursor-pointer hover:text-neutral-600'>Reply</p>

						<p className='font-normal'>
							{formatDistanceToNow(new Date(data.date_created), {
								addSuffix: true,
							})}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default CommentBox;
