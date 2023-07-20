import { forwardRef } from 'react';
import { IconType } from 'react-icons';
import { FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	labelText?: string;
	icon?: IconType;
	errors?: FieldError | undefined;
}

/**
 * Extends the basic input element functionality
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
	({ type = 'text', icon: Icon, errors, id, labelText, ...props }, ref) => {
		return (
			<div className='flex flex-col'>
				<label
					htmlFor={id}
					className='flex flex-row gap-2'
				>
					{labelText}
					{errors && errors.type === 'required' && (
						<p className='text-rose-500 italic font-semibold'>
							- Field is required
						</p>
					)}
				</label>
				<div className='relative w-full flex items-center'>
					<input
						id={id}
						className='bg-transparent placeholder:text-neutral-400 pl-8 py-2 w-full focus:outline-none focus:ring focus:border-blue-500 rounded-md'
						type={type}
						ref={ref}
						{...props}
					/>
					{Icon && (
						<Icon
							className='absolute left-1'
							size={20}
						/>
					)}
				</div>
			</div>
		);
	}
);

export default Input;
