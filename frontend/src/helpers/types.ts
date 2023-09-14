//* FORMS
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

export interface CreatePostFormInputs {
  content: string;
  file: File | undefined;
}

export interface CommentFormInput {
  content: string;
}

export interface UserUpdateForm {
  first_name?: string;
  last_name?: string;
  title?: string;
  description?: string;
  university?: string;
  actual_work?: string;
  location?: string;
}

//! END FORMS

export interface UserState {
  token: string | undefined;
  id: number | undefined;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  banner: string;
  title: string;
  description: string;
  university: string;
  actual_work: string;
  location: string;
  name: string;
  get_followers: number;
  get_following: number;
  get_posts: number;
  logged: boolean;
}

//* API RESPONSES
export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  banner: string;
  title: string;
  description: string;
  university: string;
  actual_work: string;
  location: string;
  name: string;
  get_followers: number;
  get_following: number;
  get_posts: number;
}

export interface TokenResponse {
  token: string;
  user: UserResponse;
}

export interface ErrorResponse {
  key: string;
  value: string;
}

export interface Post {
  id: string;
  user: UserResponse;
  content: string;
  date_created: string;
  file: string | undefined;
  is_liked: boolean;
  get_comments: number;
  get_likes: number;
}

export interface Comment {
  id: string;
  post: string;
  user: UserResponse;
  content: string;
  date_created: string;
  parent: string | undefined;
  replies_count: number;
  is_liked: boolean;
}

export interface ImageInformation {
  type: string;
  url: string;
}

export interface UpdateAvatarResponse {
  avatar: string;
}
