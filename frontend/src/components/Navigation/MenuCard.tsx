import { useEffect, useRef } from 'react';

interface MenuCardProps {
	children: React.ReactNode;
	onClickOutside: () => void;
}

/**
 * Component that renders a menu and closes when clicked outside
 * @see https://blog.logrocket.com/detect-click-outside-react-component-how-to/
 *
 */
const MenuCard: React.FC<MenuCardProps> = ({ children, onClickOutside }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current?.contains(event.target as Node)) {
				onClickOutside && onClickOutside();
			}
		};
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [onClickOutside]);

	return (
		<div
			className='absolute bg-slate-50 w-[280px] p-4 right-0 top-14 shadow-md border rounded-md z-50'
			ref={ref}
			onClick={onClickOutside}
		>
			{children}
		</div>
	);
};

export default MenuCard;
