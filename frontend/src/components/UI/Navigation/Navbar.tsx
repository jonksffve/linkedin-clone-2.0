import LogoIcon from '../../../assets/linkedin-logo-icon.png';

const Navbar = () => {
	return (
		<div className='px-4 py-2 bg-slate-50'>
			<nav className='flex flex-row items-center gap-4'>
				<img
					className='w-[40px] h-[40px]'
					src={LogoIcon}
					alt=''
				/>
				<div className='flex flex-row gap-4 items-center'>
					<div className='relative flex items-center '>
						<input
							placeholder='Buscar'
							type='text'
							className='bg-sky-50 pl-5 box-border'
						/>
						<p className='absolute right-2'>icon</p>
					</div>
					<div>Items</div>
				</div>
				<div className='ms-auto'>ACTIONS</div>
			</nav>
		</div>
	);
};

export default Navbar;
