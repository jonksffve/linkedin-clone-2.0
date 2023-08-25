import CardContainer from '@/components/CardContainer';
import Input from '@/components/HTMLelements/Inputs/Input';
import { useAppSelector } from '@/store/hooks';
import { BiArrowBack } from 'react-icons/bi';
import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { updateUserAPI } from '@/api/editprofile';
import { UserUpdateForm } from '@/helpers/types';

const EditProfilePage = () => {
    const userState = useAppSelector((state) => state.user);
    const [formData, setFormData] = useState<UserUpdateForm>({});

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (Object.keys(formData).length > 0 && userState.token) {
                void updateUserAPI(userState.token, formData);
            }
        },
        [formData, userState.token]
    );

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            const inputObj = { [name]: value };

            setFormData({ ...formData, ...inputObj });
        },
        [formData]
    );

    return (
        <form
            className='p-4'
            autoComplete='off'
            onSubmit={handleSubmit}
        >
            <button className='p-2 bg-white rounded-full'>
                <BiArrowBack size={20} />
            </button>
            <CardContainer>
                <Input
                    labelText='First name'
                    id='first_name'
                    placeholder={`${userState.first_name ? userState.first_name : 'What do we call you, first name?'}`}
                    name='first_name'
                    onChange={handleInputChange}
                />
                <Input
                    labelText='Last name'
                    id='last_name'
                    placeholder={`${userState.last_name ? userState.last_name : 'What do we call you, last name?'}`}
                    name='last_name'
                    onChange={handleInputChange}
                />
                <Input
                    labelText='Title'
                    id='title'
                    placeholder={`${userState.title ? userState.title : 'What are your title tags?'}`}
                    name='title'
                    onChange={handleInputChange}
                />
                <Input
                    labelText='Description'
                    id='description'
                    placeholder={`${userState.description ? userState.description : 'Describe yourself...'}`}
                    name='description'
                    onChange={handleInputChange}
                />
                <Input
                    labelText='University'
                    id='university'
                    placeholder={`${userState.university ? userState.university : 'Where did you study?'}`}
                    name='university'
                    onChange={handleInputChange}
                />
                <Input
                    labelText='Organization'
                    id='actual_work'
                    placeholder={`${
                        userState.actual_work ? userState.actual_work : 'Where are your currently working?'
                    }`}
                    name='actual_work'
                    onChange={handleInputChange}
                />
                <Input
                    labelText='Location'
                    id='location'
                    placeholder={`${userState.location ? userState.location : 'Where are you currently located?'}`}
                    name='location'
                    onChange={handleInputChange}
                />
                <div className='flex flex-col md:flex-row gap-4 justify-end'>
                    <button type='button'>CANCEL</button>
                    <button type='submit'>SAVE</button>
                </div>
            </CardContainer>
        </form>
    );
};

export default EditProfilePage;
