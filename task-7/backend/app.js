
const express = require('express');
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
	key_id: rzp_test_fiIwmRET6CApc2,
	key_secret: YAEUthsup8SijNs3iveeVlL1
});

const app = express();
const PORT = process.env.PORT || '5000';

app.listen(PORT, ()=>{
	console.log("Server is Listening on Port ", PORT);
});

app.post('/createOrder', (req, res)=>{

	const {amount,currency,receipt, notes} = req.body;
	razorpayInstance.orders.create({amount, currency, receipt, notes},
		(err, order)=>{
		if(!err)
			res.json(order)
		else
			res.send(err);
		}
	)
});

app.post('/verifyOrder', (req, res)=>{
	const {order_id, payment_id} = req.body;
	const razorpay_signature = req.headers['x-razorpay-signature'];
	const key_secret = YAEUthsup8SijNs3iveeVlL1;
	let hmac = crypto.createHmac('sha256', key_secret);
	hmac.update(order_id + "|" + payment_id);
	const generated_signature = hmac.digest('hex');
	if(razorpay_signature===generated_signature){
		res.json({success:true, message:"Payment has been verified"})
	}
	else
	res.json({success:false, message:"Payment verification failed"})
});
