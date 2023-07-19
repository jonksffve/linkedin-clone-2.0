import LoginComponent from '../components/UI/Auth/LoginComponent';

const IndexPage = () => {
	return (
		<div className='flex flex-col md:flex-row gap-8 w-full justify-center'>
			<div className='flex flex-col gap-4 basis-1/2'>
				<div>
					<h2 className='font-semibold text-xl'>
						Welcome to LinkedIn-like 2.0
					</h2>
				</div>
				<div>
					<p>
						I welcome you to this project that was designed to practice both
						backend and frontend technologies
					</p>
					<p>It includes:</p>
					<ul className=''>
						<li>Django</li>
						<li>Django Rest Framework</li>
						<li>React</li>
						<li>Redux</li>
						<li>Router dom</li>
						<li>Among any other features!</li>
					</ul>
				</div>
			</div>
			<div className='basis-1/2'>
				<LoginComponent />
			</div>
		</div>
	);
};

export default IndexPage;
