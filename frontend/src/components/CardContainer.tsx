import { twMerge } from 'tailwind-merge';

interface CardContainerProps {
	children: React.ReactNode;
	className?: string;
}

const CardContainer: React.FC<CardContainerProps> = ({
	children,
	className,
}) => {
	return (
		<div
			className={twMerge(
				'bg-white rounded-md p-4 relative flex flex-col gap-4 my-2',
				className
			)}
		>
			{children}
		</div>
	);
};

export default CardContainer;
