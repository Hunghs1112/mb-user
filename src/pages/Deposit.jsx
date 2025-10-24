import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function Deposit() {
    const [amount, setAmount] = useState('');
    const [displayAmount, setDisplayAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const { user, setAuthMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('Vui lòng đăng nhập để tiếp tục!');
            setAuthMessage('');
            navigate('/login');
        }
    }, [user, setAuthMessage, navigate]);

    const formatRecipientName = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const formatNumberWithCommas = (value) => {
        if (!value) return '';
        const digits = value.replace(/[^0-9-]/g, '');
        return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (/^-?\d*$/.test(rawValue)) {
            setAmount(rawValue);
            setDisplayAmount(formatNumberWithCommas(rawValue));
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/cash-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    account_number: user.account_number,
                    amount: parseFloat(amount || '0'),
                    recipient_name: formatRecipientName(recipientName),
                    recipient_account_number: recipientAccount,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Nạp thành công!');
                setAuthMessage('');
                setAmount('');
                setDisplayAmount('');
                setRecipientName('');
                setRecipientAccount('');
            } else {
                alert(data.message || 'Lỗi nạp!');
                setAuthMessage('');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
            setAuthMessage('');
            console.error(error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-emerald-50 dark:bg-gray-900 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 transition-colors duration-300">
            <div className="w-full max-w-lg">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 border border-emerald-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 dark:bg-emerald-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Nạp</h1>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Thực hiện giao dịch nạp vào tài khoản</p>
                        </div>
                    </div>

                    <form onSubmit={handleDeposit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Số tiền (VNĐ)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={displayAmount}
                                    onChange={handleAmountChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-emerald-50/50 dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition text-base sm:text-lg font-semibold"
                                    placeholder="0"
                                    required
                                />
                                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 font-medium text-sm sm:text-base">
                                    VNĐ
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Nội dung chuyển khoản
                            </label>
                            <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition"
                                placeholder="Tên người gửi + nội dung"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Số tài khoản người gửi
                            </label>
                            <input
                                type="text"
                                value={recipientAccount}
                                onChange={(e) => setRecipientAccount(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition"
                                placeholder="Nhập số tài khoản"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-emerald-600 dark:bg-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-800 transform hover:scale-[1.02] transition shadow-lg mt-4 sm:mt-6"
                        >
                            Xác nhận nạp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Deposit;
