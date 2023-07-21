import FeedContent from '@/components/Feed/FeedContent';

const FeedPage = () => {
	return (
		<div className='flex flex-row gap-4 h-full relative'>
			<div className='w-1/4'>1</div>
			<div className='w-2/4 max-h-screen overflow-auto'>
				<FeedContent />
			</div>
			<div className='w-1/4 sticky max-h-full'>3</div>
		</div>
	);
};

export default FeedPage;
