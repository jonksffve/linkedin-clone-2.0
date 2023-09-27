import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ImageInformation, Post, UserResponse } from '@/helpers/types';
import { getUserInformationAPI } from '@/api/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';
import ProfileImageModal from '@/components/Modals/ProfileImageModal';
import { uiActions } from '@/store/slices/ui-slice';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfilePosts from '@/components/Profile/ProfilePosts';
import { getPosts } from '@/api/feed';

const ProfilePage = () => {
	const { userEmail } = useParams();
	const userState = useAppSelector((state) => state.user);
	const uiState = useAppSelector((state) => state.ui);
	const [modalImageInformation, setModalImageInformation] = useState<ImageInformation>();
	const dispatch = useAppDispatch();

	//Profile related states
	const [editable, setEditable] = useState(false);
	const [profile, setProfile] = useState<UserResponse>();

	//Fetching posts states
	const [userPosts, setUserPosts] = useState<Post[]>([]);
	const [loadingPosts, setLoadingPosts] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (!userState.token || !userEmail) return;

			if (userEmail === userState.email) {
				setEditable(true);
			}

			await getUserInformationAPI(setProfile, userState.token, userEmail);
			await getPosts(userState.token, setUserPosts, setLoadingPosts, userEmail);
		};

		void fetchData();
	}, [userEmail, userState.email, userState.token]);

	const handleShowModal = useCallback(() => {
		dispatch(uiActions.onShowUploadModal());
	}, [dispatch]);

	const handleCloseModal = useCallback(() => {
		dispatch(uiActions.onCloseUploadModal());
	}, [dispatch]);

	return (
		<div className='flex flex-row gap-4'>
			<div className='basis-3/4'>
				<ProfileHeader
					editable={editable}
					profile={profile}
					onEdit={handleShowModal}
					onSetInformation={setModalImageInformation}
				/>
				<p>Latest posts</p>
				<ProfilePosts
					isLoading={loadingPosts}
					data={userPosts}
				/>
			</div>
			<div className='basis-1/4'>
				<ConnectionsSummary />
			</div>
			{editable && (
				<ProfileImageModal
					isOpen={uiState.showUploadModal}
					onClose={handleCloseModal}
					imageInfo={modalImageInformation}
				/>
			)}
		</div>
	);
};

export default ProfilePage;
