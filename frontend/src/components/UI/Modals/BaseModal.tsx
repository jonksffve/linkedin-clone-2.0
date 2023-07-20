import { AiOutlineClose } from 'react-icons/ai';

interface BaseModalProps {
	children: React.ReactNode;
	onShow: boolean;
	onClose: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({ onShow, onClose, children }) => {
	if (!onShow) return;

	return (
		<>
			<div
				className='bg-neutral-500/60 backdrop-blur-sm fixed inset-0'
				onClick={onClose}
			/>
			<div className='fixed drop-shadow-md border border-neutral-700 top-[50%] left-[50%] h-full md:h-auto md:max-h-[85vh] w-full md:max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-slate-100 p-8 focus:outline-none'>
				<AiOutlineClose
					onClick={onClose}
					className='text-neutral-500 absolute top-5 right-5 cursor-pointer'
					size={20}
				/>
				{children}
			</div>
		</>
	);
};

export default BaseModal;