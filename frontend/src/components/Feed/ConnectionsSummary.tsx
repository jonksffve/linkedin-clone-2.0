import CardContainer from '../UI/CardContainer';
import logoUser from '@assets/user-placeholder.jpeg';
import Button from '../UI/HTMLelements/Buttons/Button';
import { AiOutlineArrowRight, AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { ROUTE_INDEX } from '@/helpers/routes';

const ConnectionsSummary = () => {
	return (
		<CardContainer>
			<h2 className='font-semibold'>Add connections</h2>
			<div className='flex flex-row gap-2 relative items-center hover:bg-neutral-200 p-2 rounded-md'>
				<img
					className='w-[45px] h-[45px] rounded-full'
					src={logoUser}
					alt=''
				/>
				<div className='flex flex-col gap-0'>
					<h2 className='font-semibold'>Name</h2>
					<p className='text-sm text-neutral-400 truncate'>Description</p>
				</div>
				<Button className='p-0 absolute right-5'>
					<AiOutlinePlus size={24} />
				</Button>
			</div>
			<div className='flex flex-row gap-2 relative items-center hover:bg-neutral-200 p-2 rounded-md'>
				<img
					className='w-[45px] h-[45px] rounded-full'
					src={logoUser}
					alt=''
				/>
				<div className='flex flex-col gap-0'>
					<h2 className='font-semibold'>Name</h2>
					<p className='text-sm text-neutral-400 truncate'>Description</p>
				</div>
				<Button className='p-0 absolute right-5'>
					<AiOutlinePlus size={24} />
				</Button>
			</div>
			<div className='flex flex-row gap-2 relative items-center hover:bg-neutral-200 p-2 rounded-md'>
				<img
					className='w-[45px] h-[45px] rounded-full'
					src={logoUser}
					alt=''
				/>
				<div className='flex flex-col gap-0'>
					<h2 className='font-semibold'>Name</h2>
					<p className='text-sm text-neutral-400 truncate'>Description</p>
				</div>
				<Button className='p-0 absolute right-5'>
					<AiOutlinePlus size={24} />
				</Button>
			</div>
			<Link
				to={ROUTE_INDEX}
				className='flex flex-row items-center justify-between hover:bg-neutral-200 p-2 rounded-md'
			>
				<p className='text-neutral-600 font-semibold font-sans'>
					View all recommendations
				</p>
				<AiOutlineArrowRight />
			</Link>
		</CardContainer>
	);
};

export default ConnectionsSummary;
