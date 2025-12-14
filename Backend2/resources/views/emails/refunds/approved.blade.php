<!DOCTYPE html>
<html>
<head>
    <title>Refund Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Refund Approved</h2>
        <p>Hi,</p>
        <p>Your refund request for Order <strong>#{{ $refund->order_id }}</strong> has been approved.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #166534; font-weight: bold;">Refund Amount: Rs. {{ $refund->amount }}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.9em;">Credited to your Fireshop Wallet</p>
        </div>

        <p>You can use this balance for your future purchases.</p>
        <p>Thanks,<br>Fireshop Team</p>
    </div>
</body>
</html>
