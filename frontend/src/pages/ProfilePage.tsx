import { Link, useParams } from 'react-router-dom';
import { useCallback, useMemo, useState, useEffect } from 'react';
import CardContainer from '@/components/CardContainer';
import { ImageInformation, UserResponse } from '@/helpers/types';
import { getUserInformationAPI } from '@/api/auth';
import { useAppSelector } from '@/store/hooks';
import { FiEdit2 } from 'react-icons/fi';
import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';
import { ROUTE_PROFILE_EDIT } from '@/helpers/routes';
import ProfileImageModal from '@/components/Modals/ProfileImageModal';

const ProfilePage = () => {
    const { userEmail } = useParams();
    const userState = useAppSelector((state) => state.user);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalImageInformation, setmodalImageInformation] = useState<ImageInformation>();

    const [profile, setProfile] = useState<UserResponse>();

    useMemo(() => {
        if (!userState.token || !userEmail) return;

        void getUserInformationAPI(userState.token, userEmail)
            .then((response) => {
                setProfile(response?.data as UserResponse);
                console.log(response);
            })
            .catch((err) => console.log(err));
    }, [userState.token, userEmail]);

    const handleShowModal = useCallback(() => {
        setModalOpened(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpened(false);
    }, []);

    useEffect(() => {
        console.log(modalImageInformation);
    }, [modalImageInformation]);

    return (
        <div className='flex flex-row gap-4'>
            <div className='basis-3/4'>
                <CardContainer>
                    <div className='relative'>
                        <img
                            src={profile?.banner}
                            alt=''
                            className='h-[200px] w-full bg-neutral-400 rounded-t-lg'
                        />
                        <img
                            onClick={() => {
                                setmodalImageInformation(() => {
                                    if (!profile?.avatar) return;

                                    return {
                                        type: 'avatar',
                                        url: profile.avatar,
                                    };
                                });
                                handleShowModal();
                            }}
                            src={profile?.avatar}
                            alt=''
                            className='w-[150px] h-[150px] rounded-full border-2 border-black absolute bottom-[-20%] left-5 hover:cursor-pointer'
                        />
                        <button
                            className='absolute top-5 right-5 rounded-full bg-white p-2'
                            onClick={() => {
                                setmodalImageInformation(() => {
                                    if (!profile?.avatar) return;

                                    return {
                                        type: 'banner',
                                        url: profile.banner,
                                    };
                                });
                                handleShowModal();
                            }}
                        >
                            <FiEdit2 size={20} />
                        </button>
                    </div>
                    <div className='relative mt-10 p-4 flex flex-row gap-2 w-full'>
                        <div className='w-1/2'>
                            <p className='font-semibold'>{profile?.name}</p>
                            <p className='text-neutral-500 text-sm'>
                                {profile?.title ? profile.title : 'No title set'}
                            </p>
                            <p>{profile?.description ? profile.description : 'No description set'}</p>

                            <p className='text-blue-500 text-sm font-semibold mt-2'>
                                {profile?.get_followers} contacts
                            </p>
                        </div>
                        <div className='w-1/2'>
                            <p>{profile?.university ? profile.university : 'No university set'}</p>
                            <p>{profile?.actual_work ? profile.actual_work : 'No organization set'}</p>
                            <p className='text-neutral-400 text-sm'>
                                {profile?.location ? profile.location : 'No location set'}
                            </p>
                        </div>
                        <Link
                            className='absolute top-0 right-5 rounded-full bg-white p-2'
                            to={ROUTE_PROFILE_EDIT}
                        >
                            <FiEdit2 size={20} />
                        </Link>
                    </div>
                </CardContainer>
                <p>Latest posts</p>
                <CardContainer>Body Posts</CardContainer>
            </div>
            <div className='basis-1/4'>
                <CardContainer>
                    <ConnectionsSummary />
                </CardContainer>
            </div>
            <ProfileImageModal
                isOpen={modalOpened}
                onClose={handleCloseModal}
                imageInfo={modalImageInformation}
            />
        </div>
    );
};

export default ProfilePage;
