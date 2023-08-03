import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '../pages/IndexPage';
import RootLayout from './layouts/RootLayout';
import ErrorPage from '../pages/ErrorPage';
import FeedPage from '@/pages/FeedPage';
import ProfilePage from '@/pages/ProfilePage';

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
				element: <FeedPage />,
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
			{
				path: 'profile/:userEmail/',
				element: <ProfilePage />,
			},
		],
	},
]);
