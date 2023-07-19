import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '../pages/IndexPage';
import RootLayout from './layouts/RootLayout';
import ErrorPage from '../pages/ErrorPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <IndexPage />,
			},
			{
				path: 'feed/',
				element: <h2>Feed</h2>,
			},
			{
				path: 'connections/',
				element: <h2>connections</h2>,
			},
			{
				path: 'jobs/',
				element: <h2>jobs</h2>,
			},
			{
				path: 'chat/',
				element: <h2>chat</h2>,
			},
			{
				path: 'notifications/',
				element: <h2>notifications</h2>,
			},
		],
	},
	{
		path: 'register/',
		element: <div>Register</div>,
	},
	{
		path: 'login/',
		element: <div>Login</div>,
	},
]);
