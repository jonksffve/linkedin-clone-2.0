import LogoIcon from '../../../assets/linkedin-logo-icon.png';

interface HeaderProps {
	title: string;
}

/**
 * Renders a heading component with a title and the page's Logo
 */
const Header: React.FC<HeaderProps> = ({ title }) => {
	return (
		<div className='flex flex-col justify-center items-center gap-2 mb-4'>
			<img
				className='w-[52px] h-[52px]'
				src={LogoIcon}
				alt=''
			/>
			<p>{title}</p>
		</div>
	);
};

export default Header;
