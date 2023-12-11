import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'

function Bookingscreen({ match }) {
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null); 
  const fromdate = moment(match.params.fromdate, 'DD-MM-YYYY');
  const todate = moment(match.params.todate, 'DD-MM-YYYY');
  const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;
  const [totalamount, settotalamount] = useState()
  useEffect(() => {

    if(!localStorage.getItem('currentUser')){
      window.location.reload='/login'
    }
    async function fetchRoom() {
      try {
        const response = await axios.post("/api/rooms/getroombyid", { roomid: match.params.roomid });
        settotalamount(response.data.rentperday * totaldays)
        setRoom(response.data);
        setloading(false);
      } catch (error) {
        setloading(false);
        setError(true);
      }
    }

    fetchRoom();
  }, [match.params.roomid]);


  async function onToken(token) {
    console.log(token)
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token
    };

    try {
      setloading(true);
      const result = await axios.post('/api/bookings/bookroom', bookingDetails)
      setloading(false);
      Swal.fire('!!! Congratulations !!!', 'Your Room Booked Successfully', 'SUCCESS').then(result => {
        window.location.href='/home'
      })
    }
    catch (error) {
      setloading(false)
      Swal.fire('!!! OOPS... !!!', 'Something Went Wrong', 'Please Try Again...')
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1 style={{ fontSize: '30px', fontWeight: "bolder" }}>{room.name}</h1>
              <img src={room.imageurls[0]} className='bigimg' />
            </div>

            <div className="col-md-6">
              <div style={{ textAlign: 'right' }}>
                <h1 style={{ fontSize: '30px', fontWeight: "bolder" }}>
                  Booking Details</h1>
                <hr />
                <b>
                  <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name} </p>
                  <p>From Date : {match.params.fromdate}</p>
                  <p>To Date : {match.params.todate}</p>
                  <p>Max Guests : {room.maxcount} </p>
                </b>
              </div>
              <div style={{ textAlign: 'right' }}>
                <b>
                  <h1 style={{ fontSize: '30px', fontWeight: "bolder" }}>Amount</h1>
                  <hr />
                  <p>Total Days : {totaldays} </p>
                  <p>Rent P/D : ${room.rentperday}</p>
                  <p>Total Amount : ${totalamount} </p>
                </b>
              </div>
              <div style={{ float: 'right' }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency='CAD'
                  stripeKey="pk_test_51O6xaxGsvwvsH39ePjgnP9Ccj1DMZjcOCrXJcmr86aFGUdspcLb4mxMAJSj9Aya5BFnlvxdmXy94M61VBr6vNMj500HyyOFCBO"
                >
                  <button className='btn btn-primary' onClick={onToken}>Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error/>
      )}
    </div>
  );
}

export default Bookingscreen;
