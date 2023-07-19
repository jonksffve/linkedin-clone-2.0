import { BiSearch } from 'react-icons/bi';

const SearchBar = () => {
	return (
		<div className='relative flex items-center '>
			<input
				placeholder='Search'
				type='text'
				className='bg-blue-100 pl-6 py-1 rounded-md box-border w-[250px] focus:outline-none focus:ring focus:border-blue-500'
			/>
			<div className='absolute left-1'>
				<BiSearch />
			</div>
		</div>
	);
};

export default SearchBar;
