import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';
import PostContent from '@/components/Feed/PostContent';
import PostCreation from '@/components/Feed/PostCreation';
import ProfileSummary from '@/components/Feed/ProfileSummary';
import Spinner from '@/components/UI/Spinner';

const FeedPage = () => {
	return (
		<div className='flex space-x-4'>
			<div className='w-1/4 p-2 sticky top-0 left-0 h-screen'>
				<ProfileSummary />
			</div>
			<div className='w-1/2 p-2 mx-auto'>
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
			<div className='w-1/4 p-2 sticky top-0 right-0 h-screen'>
				<ConnectionsSummary />
			</div>
		</div>
	);
};

export default FeedPage;
