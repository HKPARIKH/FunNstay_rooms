const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/room');
const stripe = require('stripe')('sk_test_51O6xaxGsvwvsH39eEURv2Gs0dnce7G2GEDassfxu3Sbdf2glTnTtxjui1Z7GGjVtXLyZ2Pn1lyqgkDDUZt8xQJ7V00Gkq8vChl');

router.post("/bookroom", async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body;

    try {
        // Create a customer in Stripe
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        // Charge the customer
        const payment = await stripe.charges.create({
            amount: totalamount * 100, // Amount in cents
            customer: customer.id,
            currency: 'CAD',
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        });

        if (payment) {
            // Create a new booking
            const newbooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromdate: moment(fromdate).format('DD-MM-YYYY'),
                todate: moment(todate).format('DD-MM-YYYY'),
                totalamount,
                totaldays,
                transactionId: payment.id // Use the actual payment ID
            });

            const booking = await newbooking.save();
            
            // Update room's current bookings
            const roomtemp = await Room.findOne({ _id: room._id });
            roomtemp.currentbookings.push({
                bookingid: booking._id,
                fromdate: moment(fromdate).format('DD-MM-YYYY'),
                todate: moment(todate).format('DD-MM-YYYY'),
                userid: userid,
                status: booking.status // Use the actual status
            });

            await roomtemp.save();

        }
        res.send ("Payment Successfull, Your room is booked");
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

router.post("/getbookingsbyuserid" , async (req,res) => {
    const userid = req.body.userid

    try {
      const bookings = await Booking.find({userid : userid})  
      res.send(bookings)
    } catch (error) {
        return res.status(400).json({error});
        
    }
});

router.post("/canclebooking" , async (req,res) => {
    const {bookingid , roomid} = req.body

    try {
      const bookingitem = await Booking.findOne({_id : bookingid}) 
      bookingitem.status = 'cancelled' 
      await bookingitem.save()
      const room = await Room.findOne({_id : roomid})
      const bookings = room.currentbookings
      const temp = bookings.filter(booking => booking.bookingid.toString()!==bookingid);
      room.currentbookings = temp
      await room.save()

      res.send('Your booking Canclled successfully')
    } catch (error) {
        return res.status(400).json({error});
        
    }
});


router.get("/getallbookings" , async (req,res) => {

    try {
      const bookings = await Booking.find()  
      res.send(bookings)
    } catch (error) {
        return res.status(400).json({error});
        
    }
});

module.exports = router;
