import { ROUTE_PROFILE_EDIT } from '@/helpers/routes';
import { ImageInformation, UserResponse } from '@/helpers/types';
import { useAppSelector } from '@/store/hooks';
import { FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
	editable: boolean;
	profile: UserResponse | undefined;
	onEdit: () => void;
	onSetInformation: React.Dispatch<React.SetStateAction<ImageInformation | undefined>>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ editable, profile, onEdit, onSetInformation }) => {
	const userState = useAppSelector((state) => state.user);

	return (
		<>
			<div className='relative'>
				<img
					src={editable ? userState.banner : profile?.banner}
					alt=''
					className='h-[200px] w-full bg-neutral-400 rounded-t-lg'
				/>
				{editable && (
					<img
						onClick={() => {
							onSetInformation(() => {
								if (!profile) return;

								return {
									type: 'avatar',
									url: profile.avatar,
								};
							});
							onEdit();
						}}
						src={userState.avatar}
						alt=''
						className='w-[150px] h-[150px] rounded-full border-2 border-black absolute bottom-[-20%] left-5 hover:cursor-pointer'
					/>
				)}
				{!editable && (
					<img
						src={profile?.avatar}
						alt=''
						className='w-[150px] h-[150px] rounded-full border-2 border-black absolute bottom-[-20%] left-5'
					/>
				)}
				{editable && (
					<button
						className='absolute top-5 right-5 rounded-full bg-white p-2'
						onClick={() => {
							onSetInformation(() => {
								if (!profile) return;

								return {
									type: 'banner',
									url: profile.banner,
								};
							});
							onEdit();
						}}
					>
						<FiEdit2 size={20} />
					</button>
				)}
			</div>
			<div className='relative mt-10 p-4 flex flex-row gap-2 w-full'>
				<div className='w-1/2'>
					<p className='font-semibold'>{profile?.name}</p>
					<p className='text-neutral-500 text-sm'>{profile?.title ? profile.title : 'No title set'}</p>
					<p>{profile?.description ? profile.description : 'No description set'}</p>

					<p className='text-blue-500 text-sm font-semibold mt-2'>{profile?.get_followers} contacts</p>
				</div>
				<div className='w-1/2'>
					<p>{profile?.university ? profile.university : 'No university set'}</p>
					<p>{profile?.actual_work ? profile.actual_work : 'No organization set'}</p>
					<p className='text-neutral-400 text-sm'>
						{profile?.location ? profile.location : 'No location set'}
					</p>
				</div>
				{editable && (
					<Link
						className='absolute top-0 right-5 rounded-full bg-white p-2'
						to={ROUTE_PROFILE_EDIT}
					>
						<FiEdit2 size={20} />
					</Link>
				)}
			</div>
		</>
	);
};

export default ProfileHeader;
