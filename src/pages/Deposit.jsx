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

    // Function to capitalize first letter of recipientName
    const formatRecipientName = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    // Function to format number with commas
    const formatNumberWithCommas = (value) => {
        if (!value) return '';
        // Remove all non-digit characters except minus sign
        const digits = value.replace(/[^0-9-]/g, '');
        // Format with commas
        return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Handle amount input change
    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for raw value
        if (/^-?\d*$/.test(rawValue)) { // Allow only digits and optional minus sign
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
                    amount: parseFloat(amount || '0'), // Parse raw value
                    recipient_name: formatRecipientName(recipientName),
                    recipient_account_number: recipientAccount,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Nạp tiền thành công!');
                setAuthMessage('');
                setAmount('');
                setDisplayAmount('');
                setRecipientName('');
                setRecipientAccount('');
            } else {
                alert(data.message || 'Lỗi nạp tiền!');
                setAuthMessage('');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
            setAuthMessage('');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Nạp tiền</h2>
                <form onSubmit={handleDeposit} className="space-y-4">
                    <input
                        type="text" // Changed to text to allow comma formatting
                        value={displayAmount}
                        onChange={handleAmountChange}
                        placeholder="Số tiền"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Nội dung chuyển khoản (tên người gửi + nội dung)"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        placeholder="Số tài khoản người gửi"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Nạp tiền
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Deposit;