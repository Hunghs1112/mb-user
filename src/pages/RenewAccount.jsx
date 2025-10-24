import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function RenewAccount() {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [amount, setAmount] = useState(0);
    const [bankCode, setBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const { user, message, setAuthMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRentalPlans();
        fetchQrInfo();
    }, []);

    useEffect(() => {
        if (message) {
            alert(message);
            setAuthMessage('');
        }
    }, [message, setAuthMessage]);

    const fetchRentalPlans = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/rental-plans`);
            const data = await response.json();
            if (data.success) {
                setPlans(data.plans);
            } else {
                alert('Lỗi tải danh sách gói gia hạn!');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
        }
    };

    const fetchQrInfo = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/qr-codes`);
            const data = await response.json();
            if (data.success) {
                setBankCode(data.bank_code);
                setAccountNumber(data.account_number);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePlanChange = async (e) => {
        const planId = e.target.value;
        setSelectedPlan(planId);
        if (planId) {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/rental-plans/${planId}`);
                const data = await response.json();
                if (data.success) {
                    setAmount(data.plan.price);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setAmount(0);
        }
    };

    const handleConfirm = async () => {
        if (!selectedPlan || amount <= 0) {
            alert('Vui lòng chọn gói hợp lệ!');
            return;
        }
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    amount,
                    user_account_number: user.account_number,
                    user_name: user.name,
                    status: 'pending'
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Yêu cầu thanh toán đã được gửi!');
                navigate('/deposit');
            } else {
                alert(data.message || 'Lỗi gửi yêu cầu thanh toán!');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
        }
    };

    const qrUrl = bankCode && accountNumber
        ? `https://qrcode.io.vn/api/generate/${bankCode}/${accountNumber}/giahan_taikhoan`
        : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-300">
            <div className="w-full max-w-lg">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-amber-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gia hạn tài khoản</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Chọn gói và thanh toán để tiếp tục sử dụng</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Chọn gói gia hạn
                            </label>
                            <select
                                value={selectedPlan}
                                onChange={handlePlanChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition appearance-none font-medium"
                            >
                                <option value="">-- Chọn gói --</option>
                                {plans.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.duration} - ${plan.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedPlan && bankCode && accountNumber && (
                            <div className="space-y-5 mt-6">
                                {/* Payment Info */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-5 border border-amber-200 dark:border-gray-700 transition-colors duration-300">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Thông tin thanh toán
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">Ngân hàng:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{bankCode}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">Số tài khoản:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">Số tiền:</span>
                                            <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">${amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">Nội dung:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">Gia hạn tài khoản</span>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border-2 border-dashed border-amber-300 dark:border-gray-600 text-center transition-colors duration-300">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Quét mã QR để thanh toán</p>
                                    <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                        <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                        Vui lòng nhập số tiền thủ công khi quét QR
                                    </p>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 dark:hover:from-amber-600 dark:hover:to-orange-600 transform hover:scale-[1.02] transition shadow-lg shadow-amber-500/50 dark:shadow-amber-500/30"
                                >
                                    Xác nhận thanh toán
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RenewAccount;
