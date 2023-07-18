import { BiSearch } from 'react-icons/bi';

const SearchBar = () => {
	return (
		<div className='relative flex items-center '>
			<input
				placeholder='Search'
				type='text'
				className='bg-blue-100 pl-6 py-1 rounded-md box-border outline-none w-[250px]'
			/>
			<div className='absolute left-1'>
				<BiSearch />
			</div>
		</div>
	);
};

export default SearchBar;
