import { useParams } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ImageInformation, UserResponse } from '@/helpers/types';
import { getUserInformationAPI } from '@/api/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';
import ProfileImageModal from '@/components/Modals/ProfileImageModal';
import { uiActions } from '@/store/slices/ui-slice';
import ProfileHeader from '@/components/Profile/ProfileHeader';

const ProfilePage = () => {
	const { userEmail } = useParams();
	const userState = useAppSelector((state) => state.user);
	const uiState = useAppSelector((state) => state.ui);
	const [modalImageInformation, setModalImageInformation] = useState<ImageInformation>();
	const dispatch = useAppDispatch();
	const [editable, setEditable] = useState(false);
	const [profile, setProfile] = useState<UserResponse>();

	useMemo(() => {
		if (!userState.token || !userEmail) return;

		if (userEmail === userState.email) {
			setEditable(true);
		}

		void getUserInformationAPI(userState.token, userEmail)
			.then((response) => {
				setProfile(response?.data as UserResponse);
			})
			.catch((err) => console.log(err));
	}, [userState.token, userEmail, userState.email]);

	const handleShowModal = useCallback(() => {
		dispatch(uiActions.onShowUploadModal());
	}, [dispatch]);

	const handleCloseModal = useCallback(() => {
		dispatch(uiActions.onCloseUploadModal());
	}, [dispatch]);

	return (
		<div className='flex flex-row gap-4'>
			<div className='basis-3/4'>
				<CardContainer>
					<ProfileHeader
						editable={editable}
						profile={profile}
						onEdit={handleShowModal}
						onSetInformation={setModalImageInformation}
					/>
				</CardContainer>
				<p>Latest posts</p>
				<CardContainer>Body Posts</CardContainer>
			</div>
			<div className='basis-1/4'>
				<CardContainer>
					<ConnectionsSummary />
				</CardContainer>
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
