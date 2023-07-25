import { BiImageAdd } from 'react-icons/bi';
import Input from '../HTMLelements/Inputs/Input';
import BaseModal from './BaseModal';

const UploadModal = () => {
	return (
		<BaseModal
			onShow={true}
			disabled={false}
			onClose={() => {}}
		>
			<div className='flex flex-col gap-2'>
				<p>Create a post!</p>
				<Input placeholder='What are you thinking...?' />
				<div className='w-full min-h-[150px] border-2 border-neutral-300 border-dashed rounded-md relative'>
					<label
						htmlFor='fileUpload'
						className='font-semibold w-full h-full hover:cursor-pointer hover:bg-neutral-400 absolute flex items-center justify-center'
					>
						<div className='flex flex-col gap-1 items-center'>
							<BiImageAdd size={28} />
							Agregar fotos/video
						</div>
					</label>
					<input
						id='fileUpload'
						type='file'
						hidden
					/>
				</div>
				<button className='w-full border border-neutral-200 rounded-full p-2 font-semibold hover:bg-neutral-400'>
					Publish
				</button>
			</div>
		</BaseModal>
	);
};

export default UploadModal;
