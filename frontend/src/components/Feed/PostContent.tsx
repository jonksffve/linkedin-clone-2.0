import CardContainer from '../CardContainer';
import { AiOutlineClose } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import Button from '../HTMLelements/Buttons/Button';
import { GoComment } from 'react-icons/go';
import { PiShareFat } from 'react-icons/pi';
import { FaUserFriends } from 'react-icons/fa';
import { Post } from '@/helpers/types';
import CommentBox from './CommentBox';
import { useState, useCallback } from 'react';
import { getFileExtension } from '@/helpers/getFileExtension';
import LikeButton from '../HTMLelements/Buttons/LikeButton';

interface PostContentProps {
	post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
	const [showCommentBox, setShowCommentBox] = useState(false);

	const toggleCommentBox = useCallback(() => {
		setShowCommentBox(!showCommentBox);
	}, [showCommentBox]);

	const fileType = getFileExtension(post.file);

	return (
		<CardContainer>
			<div className='flex flex-row gap-2 items-center absolute right-5 text-neutral-600'>
				<Button className='hover:rounded-full p-1'>
					<BsThreeDots size={18} />
				</Button>
				<Button className='hover:rounded-full p-1'>
					<AiOutlineClose size={18} />
				</Button>
			</div>
			<div className='flex flex-row gap-2'>
				<div>
					<img
						className='w-[32px] h-[32px] rounded-full border border-black'
						src={post.user.avatar}
						alt=''
					/>
				</div>
				<div className='m-0'>
					<h2 className='font-semibold'>{post.user.name}</h2>
					<div className='flex flex-row text-neutral-400 items-center gap-1'>
						<small className='text-xs'>
							{new Date(post.date_created).toLocaleString()}
						</small>
						<p>•</p>
						<FaUserFriends />
					</div>
				</div>
			</div>
			<div className='border border-neutral-300 rounded-md flex flex-col gap-2'>
				{post.file && (
					<>
						{fileType === 'image' && (
							<img
								className='min-h-[450px] max-h-[450px] w-full object-contain'
								src={post.file}
								alt=''
							/>
						)}
						{fileType === 'video' && (
							<video
								className='min-h-[450px] max-h-[450px] w-full object-contain'
								src={post.file}
								controls
							/>
						)}
						<hr />
					</>
				)}
				<div className='p-2'>
					<p className='p-2'>{post.content}</p>
				</div>
			</div>
			<div className='flex flex-row justify-between text-neutral-500 text-sm'>
				<p>0 people have liked this post</p>
				<p>0 comments</p>
			</div>
			<div className='w-full flex flex-row justify-between text-neutral-500 font-medium'>
				<LikeButton
					postId={post.id}
					likeStatus={post.is_liked}
				/>
				<Button
					className='w-full rounded-none'
					onClick={toggleCommentBox}
				>
					Comment
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
			<hr />
			{showCommentBox && <CommentBox />}
		</CardContainer>
	);
};

export default PostContent;
