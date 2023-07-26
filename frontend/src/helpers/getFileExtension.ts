export const getFileExtension = (file: string | undefined) => {
	if (!file) return;

	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
	const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
	const extension = file.substring(file.lastIndexOf('.') + 1).toLowerCase();

	if (imageExtensions.includes(extension)) {
		return 'image';
	} else if (videoExtensions.includes(extension)) {
		return 'video';
	}
	return 'none';
};
