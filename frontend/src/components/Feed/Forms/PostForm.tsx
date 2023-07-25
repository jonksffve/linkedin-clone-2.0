import { BiImageAdd } from 'react-icons/bi';
import Input from '../../HTMLelements/Inputs/Input';
import { IconType } from 'react-icons';
import { LiaCommentDots } from 'react-icons/lia';
import Button from '@/components/HTMLelements/Buttons/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CreatePostFormInputs } from '@/helpers/types';

const PostForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreatePostFormInputs>({
		defaultValues: {
			content: undefined,
			file: undefined,
		},
	});

	return (
		<form className='flex flex-col gap-2'>
			<Input
				id='content'
				placeholder='What are you thinking...?'
				icon={LiaCommentDots as IconType}
				{...register('content', { required: true })}
			/>
			<div className='w-full min-h-[150px] border-2 border-neutral-300 border-dashed rounded-md relative'>
				<label
					htmlFor='fileUpload'
					className='w-full h-full hover:cursor-pointer hover:bg-neutral-400 absolute flex items-center justify-center'
				>
					<div className='flex flex-col gap-1 items-center'>
						<BiImageAdd size={28} />
						<p className='font-semibold'>Agregar fotos/videos*</p>
						<p className='text-xs text-neutral-500'>*optional field</p>
					</div>
				</label>
				<input
					id='fileUpload'
					type='file'
					{...(register('file'), { required: false })}
					hidden
				/>
			</div>
			<Button className='border-neutral-300 font-semibold p-2'>Publish</Button>
		</form>
	);
};

export default PostForm;
