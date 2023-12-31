/**
 * Renders 2 horizontal lines with a text in between
 */
const Divider = () => {
	return (
		<div className='relative flex py-5 items-center'>
			<div className='flex-grow border-t border-gray-400'></div>
			<span className='flex-shrink mx-4 text-gray-400'>or</span>
			<div className='flex-grow border-t border-gray-400'></div>
		</div>
	);
};

export default Divider;
