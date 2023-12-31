import { useAppSelector } from '@/store/hooks';
import Input from '../../HTMLelements/Inputs/Input';
import { LiaCommentDotsSolid } from 'react-icons/lia';
import { BsSend } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Comment, CommentFormInput } from '@/helpers/types';
import { useCallback } from 'react';
import { createComment } from '@/api/feed';

interface CommentFormProps {
	postId: string;
	parentId?: string;
	onComment: {
		setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
		setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
		setRepliesCount?: React.Dispatch<React.SetStateAction<number>>;
	};
}

const CommentForm: React.FC<CommentFormProps> = ({
	postId,
	parentId = undefined,
	onComment,
}) => {
	const userState = useAppSelector((state) => state.user);

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<CommentFormInput>({
		defaultValues: {
			content: '',
		},
	});

	const onSubmit: SubmitHandler<CommentFormInput> = useCallback(
		(data) => {
			void createComment(
				userState.token,
				postId,
				data,
				reset,
				onComment,
				parentId
			);
		},
		[userState.token, postId, onComment, parentId, reset]
	);

	return (
		<>
			<div className='p-2 flex flex-row gap-2 relative items-center'>
				<div>
					<img
						className='w-[32px] h-[32px] border border-neutral-200 rounded-full'
						src={userState.avatar}
						alt=''
					/>
				</div>
				<form
					autoComplete='off'
					className='w-full border border-neutral-200 rounded-md bg-slate-100'
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						id='content'
						placeholder={`${
							parentId ? 'Enter your reply...' : 'Enter your comment..'
						}`}
						icon={LiaCommentDotsSolid as IconType}
						{...register('content', { required: true })}
					/>
				</form>
				<button
					className='absolute right-5 text-neutral-400 hover:text-black'
					onClick={handleSubmit(onSubmit)}
				>
					<BsSend />
				</button>
			</div>
		</>
	);
};

export default CommentForm;
