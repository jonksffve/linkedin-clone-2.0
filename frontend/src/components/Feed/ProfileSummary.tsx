import { ROUTE_INDEX } from '@/helpers/routes';
import CardContainer from '../UI/CardContainer';
import bannerLogo from '@assets/banner-placeholder.jpg';
import { Link } from 'react-router-dom';
import Button from '../UI/HTMLelements/Buttons/Button';
import { useAppSelector } from '@/store/hooks';

const ProfileSummary = () => {
	const userState = useAppSelector((state) => state.user);

	return (
		<CardContainer className='p-0'>
			<div className='flex flex-col gap-2'>
				<img
					className=' w-full top-0 left-0 rounded-t-md h-[100px] shadow-sm'
					src={bannerLogo}
					alt=''
				/>
				<div className='p-2'>
					<Link to={ROUTE_INDEX}>
						<img
							className='absolute top-8 left-[calc(50%-40px)] rounded-full w-[80px] h-[80px] border-2 border-neutral-200 shadow-md'
							src={userState.avatar}
							alt=''
						/>
						<h2 className='text-center font-semibold'>{userState.name}</h2>
					</Link>
					<p className='text-center text-neutral-400 text-sm'>
						Title description
					</p>
				</div>
				<hr />
				<div>
					<Button className='flex flex-row justify-between text-sm w-full rounded-sm hover:bg-neutral-200'>
						<p>Contactos:</p>
						<span className='text-blue-500 font-semibold'>6</span>
					</Button>
					<Button className='flex flex-row justify-between text-sm w-full rounded-sm hover:bg-neutral-200'>
						<p>Invitaciones:</p>
						<span className='text-blue-500 font-semibold'>8</span>
					</Button>
				</div>
				<hr />
				<div>Buttons</div>
			</div>
		</CardContainer>
	);
};

export default ProfileSummary;
