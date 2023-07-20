const IndexPage = () => {
	return (
		<div className='flex flex-col justify-center items-center gap-4'>
			<div>
				<h2 className='font-semibold text-xl'>Welcome to LinkedIn-like 2.0</h2>
			</div>
			<div className='flex flex-col'>
				<p>
					I welcome you to this project that was designed to practice both
					backend and frontend technologies
				</p>
				<div className='flex flex-col justify-center items-center mt-5'>
					<p>It includes:</p>
					<ul className='list-disc'>
						<li>Backend</li>
						<ol className='list-decimal ml-10 mb-5'>
							<li>Django</li>
							<li>Django Rest Framework</li>
							<li>Token authorization</li>
						</ol>
						<li>Frontend</li>
						<ol className='list-decimal ml-10'>
							<li>React</li>
							<li>React Redux</li>
							<li>React Router DOM</li>
							<li>React Form Hook</li>
						</ol>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default IndexPage;
