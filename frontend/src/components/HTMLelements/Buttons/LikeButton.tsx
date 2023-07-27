import { AiOutlineLike } from 'react-icons/ai';
import Button from './Button';
import { useCallback, useEffect, useState } from 'react';
import { togglePostLike } from '@/api/feed';
import { useAppSelector } from '@/store/hooks';

interface LikeButtonProps {
	postId: string;
	likeStatus: boolean;
	onToggleLike: React.Dispatch<React.SetStateAction<number>>;
}

const LikeButton: React.FC<LikeButtonProps> = ({
	postId,
	likeStatus,
	onToggleLike,
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const userState = useAppSelector((state) => state.user);

	useEffect(() => {
		setIsLiked(likeStatus);
	}, [likeStatus]);

	const handleLike = useCallback(() => {
		if (isLiked) {
			onToggleLike((prevState) => prevState - 1);
		} else {
			onToggleLike((prevState) => prevState + 1);
		}

		void togglePostLike(userState.token, isLiked, setIsLiked, postId);
	}, [isLiked, userState.token, postId, onToggleLike]);

	return (
		<Button
			className={`w-full 
						rounded-none 
						${isLiked ? 'text-blue-500' : ''}
						${isLiked ? 'font-semibold' : ''}	
						`}
			onClick={handleLike}
		>
			{isLiked ? 'Liked' : 'Like'}
			<AiOutlineLike
				className='absolute left-5'
				size={20}
			/>
		</Button>
	);
};

export default LikeButton;
