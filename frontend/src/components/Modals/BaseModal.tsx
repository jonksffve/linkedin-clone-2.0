import { AiOutlineClose } from 'react-icons/ai';
import Spinner from '../Spinner';

interface BaseModalProps {
	children: React.ReactNode;
	onShow: boolean;
	disabled: boolean;
	onClose: () => void;
}

/**
 * Base layout component to render a modal
 */
const BaseModal: React.FC<BaseModalProps> = ({
	children,
	onShow,
	disabled,
	onClose,
}) => {
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
				{disabled && <Spinner />}
			</div>
		</>
	);
};

export default BaseModal;
