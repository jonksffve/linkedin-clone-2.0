import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';
import PostContent from '@/components/Feed/PostContent';
import PostCreation from '@/components/Feed/PostCreation';
import ProfileSummary from '@/components/Feed/ProfileSummary';
import Spinner from '@/components/UI/Spinner';

const FeedPage = () => {
	return (
		<div className='flex flex-row gap-4 h-full relative'>
			<div className='w-1/4 '>
				<ProfileSummary />
			</div>
			<div className='w-2/4 overflow-auto relative'>
				<div className='p-2'>
					<PostCreation />
					<Spinner />
					{/* <PostContent />
					<PostContent />
					<PostContent />
					<PostContent />
					<PostContent />
					<PostContent /> */}
				</div>
			</div>
			<div className='w-1/4'>
				<ConnectionsSummary />
			</div>
		</div>
	);
};

export default FeedPage;
