import { getComments, toggleCommentLike } from '@/api/feed';
import { Comment } from '@/helpers/types';
import { useAppSelector } from '@/store/hooks';
import { formatDistanceToNow, lightFormat } from 'date-fns';
import { useCallback, useState, useEffect } from 'react';
import CommentForm from '../Forms/CommentForm';

interface CommentBoxProps {
	data: Comment;
	onComment: {
		setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
	};
}

const CommentBox: React.FC<CommentBoxProps> = ({ data, onComment }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [replies, setReplies] = useState<Comment[]>([]);
	const [repliesCount, setRepliesCount] = useState(0);

	const [showReplyForm, setShowReplyForm] = useState(false);
	const userState = useAppSelector((state) => state.user);

	useEffect(() => {
		setIsLiked(data.is_liked);
		setRepliesCount(data.replies_count);
	}, [data.is_liked, data.replies_count]);

	const handleToggleLike = useCallback(() => {
		void toggleCommentLike(userState.token, isLiked, data.id, setIsLiked);
	}, [userState.token, data.id, isLiked]);

	const handleToggleReplyForm = useCallback(() => {
		setShowReplyForm(!showReplyForm);
	}, [showReplyForm]);

	const handleLoadReplies = useCallback(() => {
		void getComments(userState.token, data.post, setReplies, data.id);
	}, [data.id, data.post, userState.token]);

	return (
		<>
			<div className='flex gap-2 w-full'>
				<img
					className='w-[32px] h-[32px] rounded-full border border-black'
					src={data.user.avatar}
					alt=''
				/>
				<div className='flex flex-col gap-0 w-full'>
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
						{repliesCount > 0 && (
							<p
								className='hover:cursor-pointer hover:underline'
								onClick={handleLoadReplies}
							>
								+{repliesCount} replies
							</p>
						)}
					</div>
					{showReplyForm && (
						<CommentForm
							postId={data.post}
							parentId={data.id}
							onComment={{
								...onComment,
								setComments: setReplies,
								setRepliesCount: setRepliesCount,
							}}
						/>
					)}
					<div className='mt-2 relative'>
						<div className='absolute h-full w-1 bg-gray-300 left-[-20px] top-[-20px]'></div>
						{replies.map((reply) => (
							<CommentBox
								key={reply.id}
								data={reply}
								onComment={onComment}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default CommentBox;
