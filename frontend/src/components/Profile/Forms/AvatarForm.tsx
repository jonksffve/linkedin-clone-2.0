import { updateAvatarAPI } from '@/api/editprofile';
import { useAppSelector } from '@/store/hooks';
import { useCallback, useState } from 'react';

const AvatarForm = () => {
    const [newImage, setNewImage] = useState<File | undefined>(undefined);
    const userState = useAppSelector((state) => state.user);

    const submitHandler = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!newImage || !userState.token) return;
            void updateAvatarAPI(newImage, userState.token);
        },
        [newImage, userState.token]
    );

    const imageChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setNewImage(e.target.files[0]);
    }, []);

    return (
        <form
            className='w-full flex flex-col'
            onSubmit={submitHandler}
        >
            <input
                type='file'
                onChange={imageChangeHandler}
            />
            <div className='flex flex-row justify-end gap-2'>
                <button type='button'>Cancel</button>
                <button type='submit'>Save</button>
            </div>
        </form>
    );
};

export default AvatarForm;
