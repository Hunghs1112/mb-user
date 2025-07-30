import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function ChangeAccountInfo() {
    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [imageFile, setImageFile] = useState(null); // For file upload
    const [imageUrl, setImageUrl] = useState(''); // For URL input
    const { user, setAuthMessage } = useAuth();

    // Local state to manage user data independently of context
    const [localUser, setLocalUser] = useState(user || {});

    // Debug user object on mount and update
    useEffect(() => {
        console.log('User object (context):', user);
        console.log('Local user object:', localUser);
        // Refetch user data on mount to ensure current image is loaded
        fetchUser();
    }, [user]);

    // Fetch user data
    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/${user?.account_number || '123321123'}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.log(`Fetch error: ${response.status}, ${errorText}`);
                return;
            }
            const data = await response.json();
            console.log('Fetched user data:', data);
            if (data.success && data.user) {
                // Update local state and sync with localStorage
                setLocalUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store the file object
            setImageUrl(''); // Clear URL if file is selected
        }
    };

    // Handle URL change
    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url); // Store the URL
        setImageFile(null); // Clear file if URL is entered
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('new_account_number', accountNumber);
        if (imageFile) {
            formData.append('image', imageFile); // Append file for server to save
        } else if (imageUrl) {
            formData.append('image_url', imageUrl); // Append URL for server to store
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/account/${user.account_number}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();
            console.log('Update response:', data);
            if (data.success) {
                alert('Thông tin tài khoản đã được cập nhật!');
                setAuthMessage('');
                const updatedUser = { ...user };
                if (accountNumber) updatedUser.account_number = accountNumber;
                if (name) updatedUser.name = name;
                if (data.image) {
                    updatedUser.image = data.image; // Could be path or URL based on server response
                }
                // Update local state and sync with localStorage
                setLocalUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Refetch to ensure consistency with server
                await fetchUser();
            } else {
                alert(data.message || 'Lỗi cập nhật thông tin!');
                setAuthMessage('');
            }
        } catch (error) {
            alert(`Lỗi kết nối server: ${error.message}`);
            setAuthMessage('');
            console.error(error);
        }
    };

    // Determine image source based on whether it's a local path or external URL
    const getImageSrc = (image) => {
        if (!image) return '';
        // Check if it's an external URL (starts with http or https)
        if (image.startsWith('http://') || image.startsWith('https://')) {
            return image;
        }
        // Assume it's a local path (e.g., /uploads/...)
        return `${API_CONFIG.BASE_URL}${image}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Đổi thông tin tài khoản</h2>
                <div className="mb-6 text-center">
                    <p className="text-white text-lg">Tên hiện tại: {localUser?.name || 'Chưa có thông tin'}</p>
                    <p className="text-white text-lg">Số tài khoản hiện tại: {localUser?.account_number || 'Chưa có thông tin'}</p>
                    <p className="text-white text-lg">Ảnh đại diện hiện tại: 
                        {localUser?.image ? (
                            <img 
                                src={getImageSrc(localUser.image)} 
                                alt="Current Avatar" 
                                className="w-16 h-16 rounded-full mx-auto mt-2" 
                                onError={(e) => { 
                                    console.log('Image load error:', e); 
                                    console.log('Image URL:', getImageSrc(localUser.image)); 
                                }} 
                            />
                        ) : (
                            'Chưa có ảnh'
                        )}
                    </p>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4" encType="multipart/form-data">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên mới (không bắt buộc)"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Số tài khoản mới (không bắt buộc)"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={handleUrlChange}
                        placeholder="Hoặc nhập URL ảnh (không bắt buộc)"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangeAccountInfo;