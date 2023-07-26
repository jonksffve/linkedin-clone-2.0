import { BiImageAdd } from 'react-icons/bi';
import Input from '../../HTMLelements/Inputs/Input';
import { IconType } from 'react-icons';
import { LiaCommentDots } from 'react-icons/lia';
import Button from '@/components/HTMLelements/Buttons/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CreatePostFormInputs, Post } from '@/helpers/types';
import { useCallback, useState } from 'react';
import { createPost } from '@/api/feed';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Spinner from '@/components/Spinner';

interface PostFormProps {
	onAction: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostForm: React.FC<PostFormProps> = ({ onAction }) => {
	const userState = useAppSelector((state) => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreatePostFormInputs>({
		defaultValues: {
			content: '',
			file: undefined,
		},
	});

	const file_content = watch('file');

	const onSubmit: SubmitHandler<CreatePostFormInputs> = useCallback(
		(data) => {
			void createPost(
				userState.token,
				data,
				setIsLoading,
				onAction,
				reset,
				dispatch
			);
		},
		[userState.token, onAction, dispatch, reset]
	);

	return (
		<form
			autoComplete='off'
			className='flex flex-col gap-2'
			onSubmit={handleSubmit(onSubmit)}
		>
			{isLoading && <Spinner mask />}
			<Input
				errors={errors.content}
				labelText='Content'
				id='content'
				placeholder='What are you thinking...?'
				icon={LiaCommentDots as IconType}
				{...register('content', { required: true })}
			/>
			<div className='w-full min-h-[150px] border-2 border-neutral-300 border-dashed rounded-md relative'>
				<label
					htmlFor='file'
					className='w-full h-full hover:cursor-pointer hover:bg-neutral-400 absolute flex items-center justify-center'
				>
					<div className='flex flex-col gap-1 justify-center items-center'>
						<BiImageAdd size={28} />
						{file_content ? (
							<div className='flex justify-center text-neutral-600 text-xs'>
								{file_content.name}
							</div>
						) : (
							<>
								<p className='font-semibold'>Add pictures/videos*</p>
								<p className='text-xs text-neutral-500'>*optional field</p>
							</>
						)}
					</div>
				</label>
				<input
					id='file'
					type='file'
					accept='image/*, video/*'
					{...(register('file'), { required: false })}
					onChange={(e) => {
						if (!e.target.files) return;
						setValue('file', e.target.files[0]);
					}}
					hidden
				/>
			</div>
			<Button
				className='border-neutral-300 font-semibold p-2'
				type='submit'
			>
				Publish
			</Button>
		</form>
	);
};

export default PostForm;
