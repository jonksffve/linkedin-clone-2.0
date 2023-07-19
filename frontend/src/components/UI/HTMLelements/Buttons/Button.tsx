import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
	icon: Icon,
	type = 'button',
	disabled,
	className,
	children,
	...props
}) => {
	return (
		<div
			className={twMerge(
				`flex flex-row bg-transparent border border-transparent rounded-full p-3 items-center justify-center relative w-full
		${
			disabled
				? 'cursor-not-allowed bg-neutral-400/75'
				: 'cursor-pointer hover:bg-neutral-300'
		}
		`,
				className
			)}
		>
			<button
				type={type}
				disabled={disabled}
				className='disabled:cursor-not-allowed disabled:opacity-75'
				{...props}
			>
				{children}
			</button>
			{Icon && (
				<Icon
					className='absolute left-5'
					size={20}
				/>
			)}
		</div>
	);
};

export default Button;
