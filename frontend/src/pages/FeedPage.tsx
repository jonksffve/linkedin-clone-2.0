import { getPosts } from '@/api/feed';
import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';
import PostContent from '@/components/Feed/Post/PostContent';
import PostCreation from '@/components/Feed/Post/PostCreation';
import ProfileSummary from '@/components/Feed/ProfileSummary';
import UploadModal from '@/components/Modals/UploadModal';
import Spinner from '@/components/Spinner';
import { Post } from '@/helpers/types';
import { useAppSelector } from '@/store/hooks';
import { useState, useEffect } from 'react';

const FeedPage = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const userState = useAppSelector((state) => state.user);

	useEffect(() => {
		if (!userState.token) return;

		void getPosts(userState.token, setPosts, setIsLoading);
	}, [userState.token]);

	return (
		<>
			<div className='flex space-x-4'>
				<div className='hidden md:block w-1/4 p-2 sticky top-0 left-0 h-screen'>
					<ProfileSummary />
				</div>
				<div className='w-full md:w-1/2 p-2 mx-auto'>
					<div className='p-2'>
						<PostCreation />
						{isLoading && <Spinner />}
						{!isLoading && posts.length === 0 && (
							<div className='p-2 text-center mt-4'>
								<p>No posts have been found!</p>
							</div>
						)}
						{posts.length > 0 &&
							posts.map((post) => (
								<PostContent
									key={post.id}
									post={post}
								/>
							))}
					</div>
				</div>
				<div className='hidden md:block w-1/4 p-2 sticky top-0 right-0 h-screen'>
					<ConnectionsSummary />
				</div>
			</div>
			<UploadModal onAction={setPosts} />
		</>
	);
};

export default FeedPage;
