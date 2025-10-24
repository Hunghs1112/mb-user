import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function ChangeAccountInfo() {
    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const { user, setAuthMessage } = useAuth();
    const [localUser, setLocalUser] = useState(user || {});

    useEffect(() => {
        fetchUser();
    }, [user]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/${user?.account_number || '123321123'}`);
            if (!response.ok) return;
            const data = await response.json();
            if (data.success && data.user) {
                setLocalUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrl('');
        }
    };

    const handleUrlChange = (e) => {
        setImageUrl(e.target.value);
        setImageFile(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('new_account_number', accountNumber);
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (imageUrl) {
            formData.append('image_url', imageUrl);
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/account/${user.account_number}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                alert('Thông tin tài khoản đã được cập nhật!');
                setAuthMessage('');
                const updatedUser = { ...user };
                if (accountNumber) updatedUser.account_number = accountNumber;
                if (name) updatedUser.name = name;
                if (data.image) updatedUser.image = data.image;
                setLocalUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                await fetchUser();
            } else {
                alert(data.message || 'Lỗi cập nhật thông tin!');
                setAuthMessage('');
            }
        } catch (error) {
            alert(`Lỗi kết nối server: ${error.message}`);
            setAuthMessage('');
        }
    };

    const getImageSrc = (image) => {
        if (!image) return '';
        if (image.startsWith('http://') || image.startsWith('https://')) return image;
        return `${API_CONFIG.BASE_URL}${image}`;
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-indigo-50 dark:bg-gray-900 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 transition-colors duration-300">
            <div className="w-full max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-indigo-100 dark:border-gray-700 transition-colors duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 dark:bg-indigo-700 p-5 sm:p-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white">Thông tin tài khoản</h1>
                                <p className="text-blue-100 text-xs sm:text-sm">Quản lý thông tin cá nhân của bạn</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Info */}
                    <div className="p-4 sm:p-8 bg-indigo-50 dark:bg-gray-900 border-b border-indigo-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <div className="flex-shrink-0">
                                {localUser?.image ? (
                                    <img 
                                        src={getImageSrc(localUser.image)} 
                                        alt="Avatar" 
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg" 
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center shadow-lg">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm transition-colors duration-300">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Họ và tên</p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{localUser?.name || 'Chưa có'}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm transition-colors duration-300">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số tài khoản</p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{localUser?.account_number || 'Chưa có'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Form */}
                    <div className="p-5 sm:p-8">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Cập nhật thông tin</h3>
                        <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-5" encType="multipart/form-data">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                        Tên mới
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        placeholder="Nhập tên mới"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                        Số tài khoản mới
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        placeholder="Nhập số mới"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                    Tải ảnh đại diện
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 file:font-semibold hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                    Hoặc nhập URL ảnh
                                </label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={handleUrlChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-indigo-600 dark:bg-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-800 transform hover:scale-[1.02] transition shadow-lg mt-4 sm:mt-6"
                            >
                                Cập nhật thông tin
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeAccountInfo;
