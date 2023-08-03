import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { UserResponse } from '@/helpers/types';
import { getUserInformationAPI } from '@/api/auth';
import { useAppSelector } from '@/store/hooks';
import { FiEdit2 } from 'react-icons/fi';
import ConnectionsSummary from '@/components/Feed/ConnectionsSummary';

const ProfilePage = () => {
    const { userEmail } = useParams();
    const userState = useAppSelector((state) => state.user);
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
                            src={profile?.avatar}
                            alt=''
                            className='w-[150px] h-[150px] rounded-full border-2 border-black absolute bottom-[-20%] left-5 hover:cursor-pointer'
                        />
                        <button className='absolute top-5 right-5 rounded-full bg-white p-2'>
                            <FiEdit2 size={20} />
                        </button>
                    </div>
                    <div className='relative mt-10'>
                        <div>
                            <p className='font-semibold'>{profile?.name}</p>
                            <p>{profile?.description}</p>
                            <p className='text-neutral-400 text-sm'>{profile?.location}</p>
                            <p className='text-blue-500 text-sm font-semibold'>{profile?.get_followers} contacts</p>
                        </div>
                        <button className='absolute top-0 right-5 rounded-full bg-white p-2'>
                            <FiEdit2 size={20} />
                        </button>
                    </div>
                </CardContainer>
                <CardContainer>Body Posts</CardContainer>
            </div>
            <div className='basis-1/4'>
                <CardContainer>
                    <ConnectionsSummary />
                </CardContainer>
            </div>
        </div>
    );
};

export default ProfilePage;
