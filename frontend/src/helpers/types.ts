export interface LoginFormInputs {
	email: string;
	password: string;
}

export interface RegisterFormInputs {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	avatar: File | undefined;
}
