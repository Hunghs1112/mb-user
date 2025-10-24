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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-300">
            <div className="w-full max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-blue-100 dark:border-gray-700 transition-colors duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Thông tin tài khoản</h1>
                                <p className="text-blue-100 text-sm">Quản lý thông tin cá nhân của bạn</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Info */}
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                                {localUser?.image ? (
                                    <img 
                                        src={getImageSrc(localUser.image)} 
                                        alt="Avatar" 
                                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg" 
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 grid md:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm transition-colors duration-300">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Họ và tên</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{localUser?.name || 'Chưa có'}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm transition-colors duration-300">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số tài khoản</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{localUser?.account_number || 'Chưa có'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Form */}
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cập nhật thông tin</h3>
                        <form onSubmit={handleUpdate} className="space-y-5" encType="multipart/form-data">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Tên mới
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        placeholder="Nhập tên mới"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Số tài khoản mới
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        placeholder="Nhập số mới"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Tải ảnh đại diện
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 file:font-semibold hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Hoặc nhập URL ảnh
                                </label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={handleUrlChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transform hover:scale-[1.02] transition shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30 mt-6"
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
