import { ImageInformation } from '@/helpers/types';
import BaseModal from './BaseModal';
import AvatarForm from '../Profile/Forms/AvatarForm';
import BannerForm from '../Profile/Forms/BannerForm';

interface ProfileImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageInfo: ImageInformation | undefined;
}

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({ isOpen, onClose, imageInfo }) => {
    if (!imageInfo) return;

    return (
        <BaseModal
            disabled={false}
            onShow={isOpen}
            onClose={onClose}
        >
            <div>
                <h2>Updating {imageInfo.type} image</h2>
                <div className='min-h-[200px] flex justify-center items-center'>
                    {imageInfo.type === 'avatar' ? (
                        <div className='flex flex-col gap-2 justify-center items-center'>
                            <img
                                className='w-[150px] h-[150px] rounded-full'
                                src={imageInfo.url}
                                alt=''
                            />

                            <AvatarForm />
                        </div>
                    ) : (
                        <div className='flex flex-col gap-2 justify-center items-center'>
                            <img
                                className='min-h-[150px] w-full'
                                src={imageInfo.url}
                                alt=''
                            />

                            <BannerForm />
                        </div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};

export default ProfileImageModal;
