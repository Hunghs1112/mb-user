import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function Withdraw() {
    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const { user, isUnlocked, setAuthMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUnlocked) {
            alert('Tài khoản của bạn đã bị khóa. Vui lòng gia hạn để sử dụng!');
            setAuthMessage('');
            navigate('/renew-account');
        }
    }, [isUnlocked, setAuthMessage, navigate]);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/cash-out`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    account_number: user.account_number,
                    amount: parseFloat(amount),
                    recipient_account_number: recipientAccount,
                    recipient_name: recipientName,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Rút tiền thành công!');
                setAuthMessage('');
                setAmount('');
                setRecipientName('');
                setRecipientAccount('');
            } else {
                alert(data.message || 'Lỗi rút tiền!');
                setAuthMessage('');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
            setAuthMessage('');
            console.error(error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-rose-50 dark:bg-gray-900 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 transition-colors duration-300">
            <div className="w-full max-w-lg">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 border border-rose-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-rose-600 dark:bg-rose-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Rút tiền</h1>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chuyển tiền đến tài khoản khác</p>
                        </div>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Số tiền (VNĐ)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-rose-50/50 dark:bg-gray-700 border border-rose-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition text-base sm:text-lg font-semibold"
                                    placeholder="0"
                                    required
                                />
                                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-rose-600 dark:text-rose-400 font-medium text-sm sm:text-base">
                                    VNĐ
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Tên người nhận
                            </label>
                            <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition"
                                placeholder="Nhập tên người nhận"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Số tài khoản người nhận
                            </label>
                            <input
                                type="text"
                                value={recipientAccount}
                                onChange={(e) => setRecipientAccount(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition"
                                placeholder="Nhập số tài khoản"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-rose-600 dark:bg-rose-700 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-rose-700 dark:hover:bg-rose-800 transform hover:scale-[1.02] transition shadow-lg mt-4 sm:mt-6"
                        >
                            Xác nhận rút tiền
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Withdraw;
