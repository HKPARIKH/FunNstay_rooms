import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'

const { TabPane } = Tabs;

function Adminscreen() {

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
            window.location.href = '/home'
        }
    }, [])

    return (
        <div className='mt-3 ml-3 mr-3 bs'>
            <h3 className='text-center' style={{ fontSize: '30px' }}><b>Admin Panel</b></h3>
            <Tabs defaultActiveKey='1'>
                <TabPane tab="Bookings" key="1">
                    <Bookings />
                </TabPane>
                <TabPane tab="Rooms" key="2">
                    <Rooms />
                </TabPane>
                <TabPane tab="Add Rooms" key="3">
                    <h1><Addroom /></h1>
                </TabPane>
                <TabPane tab="Users" key="4">
                    <h1><Users /></h1>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Adminscreen;

export function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("/api/bookings/getallbookings");
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                setError(error);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Error error={error} />;
    }

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Bookings</h1>
                {loading && <Loader />}

                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>BOOKING ID</th>
                            <th>USER ID</th>
                            <th>LOCATION</th>
                            <th>CHECKIN</th>
                            <th>CHECKOUT</th>
                            <th>TotalDays</th>
                            <th>STATUS</th>
                            <th>PAID</th>

                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length && (bookings.map(booking => {
                            return <tr>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.totaldays}</td>
                                <td>{booking.status}</td>
                                <td>${booking.totalamount}</td>
                            </tr>

                        }))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export function Rooms() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchrooms = async () => {
            try {
                const response = await axios.get("/api/rooms/getallrooms");
                setrooms(response.data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
                setError(error);
            }
        };

        fetchrooms();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Error error={error} />;
    }

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Rooms</h1>
                {loading && <Loader />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>ROOM ID</th>
                            <th>LOCATION</th>
                            <th>TYPE</th>
                            <th>RENT-PERDAY</th>
                            <th>MAX GUESTS</th>
                            <th>CONTACT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length && (rooms.map(room => {
                            return <tr>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>${room.rentperday}</td>
                                <td>{room.maxcount}</td>
                                <td>+1 {room.phonenumber}</td>
                            </tr>

                        }))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}


export function Users() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchusers = async () => {
            try {
                const response = await axios.get("/api/users/getallusers");
                setusers(response.data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
                setError(error);
            }
        };

        fetchusers();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Users</h1>
                {loading && <Loader />}
                <table className='table table-dark table-bordered'>
                    <thead className='bs'>
                        <tr>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin Access</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users && (users.map(user => {
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}



export function Addroom() {
const [loading, setloading] = useState(false);
const [error, setError] = useState();
const[name, setname] = useState('')
const[rentperday , setrentperday] = useState()
const[maxcount , setmaxcount] = useState()
const[description , setdescription] = useState()
const[phonenumber , setphonenumber] = useState()
const[type , settype] = useState()
const[imageurl1, setimageurl1] = useState()
const[imageurl2, setimageurl2] = useState()
const[imageurl3, setimageurl3] = useState()
const[imageurl4, setimageurl4] = useState()
const[imageurl5, setimageurl5] = useState()

   async function addRoom(){
        const newroom ={
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls:[ imageurl1, imageurl2, imageurl3, imageurl4, imageurl5]
        }
        try {
            setloading(true)
            const result = await (await axios.post('/api/rooms/addroom' , newroom)).data
            console.log(result)
            setloading(false)
            Swal.fire('!! Congrats !!' , "Admin, Your Room Added Successfully" , 'success').then(result=>{
                window.location.href='/home'
            })
        } catch (error) {
            console.log(error)
            setloading(false)
            Swal.fire('!!! OOPsss !!!' , "SOmething went wrong, Please try again..." , 'error')
        }
    }
    return (
        <div className='row'>
            <div className='col-md-5'>
                {loading && <Loader/>}
                <input type="text" className='form-control' placeholder='Enter Hotel Name'
                value={name} onChange={(e)=>{setname(e.target.value)}} />
                <input type="text" className='form-control' placeholder='Enter Rent-PerDay' 
                value={rentperday} onChange={(e)=>{setrentperday(e.target.value)}}/>
                <input type="text" className='form-control' placeholder='Enter Max Guests ' 
                value={maxcount} onChange={(e)=>{setmaxcount(e.target.value)}}/>
                <input type="text" className='form-control' placeholder='Enter Description' 
                value={description} onChange={(e)=>{setdescription(e.target.value)}}/>
                <input type="text" className='form-control' placeholder='Enter Phone Number' 
                value={phonenumber} onChange={(e)=>{setphonenumber(e.target.value)}}/>
                <input type="text" className='form-control' placeholder="Enter Room's type" 
                value={type} onChange={(e)=>{settype(e.target.value)}}/>
            </div>
            <div className='col-md-5'>
                <input type="text" className='form-control' placeholder='Enter Image URL 1' 
                value={imageurl1} onChange={(e)=>{setimageurl1(e.target.value)}}/>
                <input type="text" className='form-control' placeholder='Enter Image URL 2 '
                value={imageurl2} onChange={(e)=>{setimageurl2(e.target.value)}}/>
                <input type="text" className='form-control' placeholder='Enter Image URL 3' 
                value={imageurl3} onChange={(e)=>{setimageurl3(e.target.value)}}/>
                <input type="text" className='form-control' placeholder='Enter Image URL 4'
                value={imageurl4} onChange={(e)=>{setimageurl4(e.target.value)}} />
                <input type="text" className='form-control' placeholder='Enter Image URL 5' 
                value={imageurl5} onChange={(e)=>{setimageurl5(e.target.value)}}/>

                <div className='text-right'>
                    <button className='btn btn-primary mt-3' onClick={addRoom}>Add Room</button>
                </div>

            </div>
        </div>
    )
}
