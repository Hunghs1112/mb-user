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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Rút tiền</h1>
                            <p className="text-sm text-gray-600">Chuyển tiền đến tài khoản khác</p>
                        </div>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số tiền (VNĐ)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition text-lg font-semibold"
                                    placeholder="0"
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600 font-medium">
                                    VNĐ
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên người nhận
                            </label>
                            <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                                placeholder="Nhập tên người nhận"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số tài khoản người nhận
                            </label>
                            <input
                                type="text"
                                value={recipientAccount}
                                onChange={(e) => setRecipientAccount(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                                placeholder="Nhập số tài khoản"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-orange-700 transform hover:scale-[1.02] transition shadow-lg shadow-rose-500/50 mt-6"
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
