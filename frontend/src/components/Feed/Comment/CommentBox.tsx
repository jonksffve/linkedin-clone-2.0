import { toggleCommentLike } from '@/api/feed';
import { Comment } from '@/helpers/types';
import { useAppSelector } from '@/store/hooks';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useState, useEffect } from 'react';
import CommentForm from '../Forms/CommentForm';

interface CommentBoxProps {
	data: Comment;
	onComment: {
		setCount: React.Dispatch<React.SetStateAction<number>>;
	};
}

const CommentBox: React.FC<CommentBoxProps> = ({ data, onComment }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const userState = useAppSelector((state) => state.user);

	useEffect(() => {
		setIsLiked(data.is_liked);
	}, [data.is_liked]);

	const handleToggleLike = useCallback(() => {
		void toggleCommentLike(userState.token, isLiked, data.id, setIsLiked);
	}, [userState.token, data.id, isLiked]);

	const handleToggleReplyForm = useCallback(() => {
		setShowReplyForm(!showReplyForm);
	}, [showReplyForm]);

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
						<p
							className={`hover:cursor-pointer 
									hover:text-neutral-600
									${isLiked ? 'text-blue-500' : ''}
									`}
							onClick={handleToggleLike}
						>
							{isLiked ? 'Liked' : 'Like'}
						</p>
						<p
							className='hover:cursor-pointer hover:text-neutral-600'
							onClick={handleToggleReplyForm}
						>
							Reply
						</p>

						<p className='font-normal'>
							{formatDistanceToNow(new Date(data.date_created), {
								addSuffix: true,
							})}
						</p>
						{data.replies_count > 0 && (
							<p className='hover:cursor-pointer hover:underline'>
								+{data.replies_count} replies
							</p>
						)}
					</div>
				</div>
			</div>
			{showReplyForm && (
				<CommentForm
					postId={data.post}
					parentId={data.id}
					onComment={onComment}
				/>
			)}
		</>
	);
};

export default CommentBox;
