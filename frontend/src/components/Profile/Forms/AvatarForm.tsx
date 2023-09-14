import { updateUserImageAPI } from '@/api/editprofile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uiActions } from '@/store/slices/ui-slice';
import { userActions } from '@/store/slices/user-slice';
import { useCallback, useState } from 'react';


const AvatarForm = () => {
    const [newImage, setNewImage] = useState<File | undefined>(undefined);
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch()

    const submitHandler = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!newImage || !userState.token) return;
            try {
                const response = await updateUserImageAPI(newImage, userState.token, "avatar"); 
                dispatch(userActions.updateAvatar(response.avatar))
                dispatch(uiActions.onCloseUploadModal())
            } catch (error) {
                console.log(error)
            }
        },
        [newImage, userState.token, dispatch]
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
