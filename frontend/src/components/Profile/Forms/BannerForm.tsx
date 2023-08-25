const BannerForm = () => {
    return (
        <form className='w-full flex flex-col'>
            <input type='file' />
            <div className='flex flex-row justify-end gap-2'>
                <button type='button'>Cancel</button>
                <button type='submit'>Save</button>
            </div>
        </form>
    );
};

export default BannerForm;
