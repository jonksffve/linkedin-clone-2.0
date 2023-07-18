import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '../pages/IndexPage';
import RootLayout from './layouts/RootLayout';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <div>Something happened 404</div>,
		children: [
			{
				index: true,
				element: <IndexPage />,
			},
		],
	},
]);
