interface SpinnerProps {
	mask?: boolean;
}

/**
 * Loading spinner animation
 *
 * @param mask Determines weather renders a mask on top of the parent component
 */
const Spinner: React.FC<SpinnerProps> = ({ mask = false }) => {
	return (
		<>
			{mask && (
				<div className='absolute w-full h-full bg-neutral-200/40 top-0 left-0 cursor-not-allowed rounded-md z-10'></div>
			)}
			<div className='loader fixed top-[calc(35%-40px)] left-[calc(50%-40px)] translate-x-[50%] translate-y-[-50%] '></div>
		</>
	);
};

export default Spinner;
