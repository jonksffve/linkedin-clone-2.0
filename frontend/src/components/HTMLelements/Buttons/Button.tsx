import { twMerge } from 'tailwind-merge';

/**
 * Extends the basic button element functionality
 */
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
	type = 'button',
	disabled,
	className,
	children,
	...props
}) => {
	return (
		<button
			type={type}
			disabled={disabled}
			className={twMerge(
				`flex flex-row bg-transparent border border-transparent rounded-full px-4 py-1 items-center justify-center relative w-full${
					disabled
						? 'cursor-not-allowed bg-neutral-400/75'
						: 'cursor-pointer hover:bg-neutral-300'
				}`,
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
