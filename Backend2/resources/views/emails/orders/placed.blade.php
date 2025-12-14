<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Thank you for your order!</h2>
        <p>Hi {{ $order->user ? $order->user->name : 'Customer' }},</p>
        <p>Your order <strong>#{{ $order->id }}</strong> has been placed successfully.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
            @foreach($order->items as $item)
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    {{ $item->product ? $item->product->title : 'Product' }} (x{{ $item->quantity }})
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    Rs. {{ $item->price * $item->quantity }}
                </td>
            </tr>
            @endforeach
            <tr>
                <td style="padding: 10px; font-weight: bold;">Total</td>
                <td style="padding: 10px; font-weight: bold; text-align: right;">Rs. {{ $order->total_amount }}</td>
            </tr>
        </table>

        <p style="margin-top: 20px;">We will notify you when your order is shipped.</p>
        <p>Thanks,<br>Fireshop Team</p>
    </div>
</body>
</html>
