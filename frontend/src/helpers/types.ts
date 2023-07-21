export interface LoginFormInputs {
	username: string;
	password: string;
}

export interface RegisterFormInputs {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	avatar: File | undefined;
}

export interface UserState {
	token: string | undefined;
	name: string | undefined;
	avatar: string | undefined;
	id: number | undefined;
	logged: boolean | undefined;
}

export interface UserResponse {
	id: number;
	avatar: string;
	email: string;
	name: string;
}

export interface TokenResponse {
	token: string;
	user: UserResponse;
}

export interface ErrorResponse {
	key: string;
	value: string;
}
