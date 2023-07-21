const Spinner = () => {
	return (
		<>
			<div className='absolute w-full h-full bg-neutral-200/60 top-0 left-0 cursor-not-allowed rounded-md'></div>
			<div className='loader cursor-not-allowed fixed top-[calc(50%-40px)] left-[calc(50%-40px)] translate-x-[50%] translate-y-[-50%]'></div>
			;
		</>
	);
};

export default Spinner;
