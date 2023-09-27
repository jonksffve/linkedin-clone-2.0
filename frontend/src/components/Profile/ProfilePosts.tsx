import { Post } from '@/helpers/types';
import CardContainer from '../CardContainer';
import Spinner from '../Spinner';
import PostContent from '../Feed/Post/PostContent';

interface ProfilePostsProps {
	isLoading: boolean;
	data: Post[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ isLoading, data }) => {
	return (
		<CardContainer>
			<div>Body Posts</div>
			{isLoading && <Spinner />}
			{!isLoading && data.length === 0 && (
				<div className='p-2 text-center mt-4'>
					<p>User has not created any post!</p>
				</div>
			)}
			{data.length > 0 &&
				data.map((post) => (
					<PostContent
						key={post.id}
						post={post}
					/>
				))}
		</CardContainer>
	);
};

export default ProfilePosts;
