
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [type, settype] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        setloading(true)
        const response = await axios.get("/api/rooms/getallrooms");
        const data = response.data;
        setrooms(data);
        setduplicaterooms(data)
        setloading(false)
      } catch (error) {
        seterror(true)
        console.log(error)
        setloading(false)
      }
    }

    fetchData();
  }, []);

  function filterByDate(dates) {
    if (dates && dates.length === 2) {
      const fromDate = (dates[0]).format('DD-MM-YYYY');
      const toDate = (dates[1]).format('DD-MM-YYYY');
      setfromdate(fromDate);
      settodate(toDate);
    }
    var temprooms = [];

    for (const room of duplicaterooms) {
      var availability = false;

      if (room.currentbookings.length > 0) {

        for (const booking of room.currentbookings) {
          if (
            !moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(
              booking.fromdate,
              booking.todate
            ) &&
            !moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(
              booking.fromdate,
              booking.todate
            )
          ) {
            if (
              (dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
              (dates[0]).format('DD-MM-YYYY') !== booking.todate &&
              (dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
              (dates[1]).format('DD-MM-YYYY') !== booking.todate
            ) {
              availability = true;
            }
          }
        }
      }
      else {
        availability = true
      }
      if (availability == true || room.currentbookings.length == 0) {
        temprooms.push(room)
      }
    }
    setrooms(temprooms)
  }

  function filterBySearch() {
    const temprooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()))
    setrooms(temprooms)
  }
  function filterByType(e) {
    settype(e)
    if (e !== 'all') {
      const temprooms = duplicaterooms.filter(room => room.type.toLowerCase() == e.toLowerCase())
      setrooms(temprooms)
    }
    else {
      setrooms(duplicaterooms)
    }

  }

  return (
    <div className='container'>
      <div className='row mt-5 bs'>

        <div className="col.md-3">

          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input type="text" className="form-control i2 m-2" placeholder='Search location / Name'
            value={searchkey} onChange={(e) => { setsearchkey(e.target.value) }} onKeyUp={filterBySearch} />
        </div>

        <div className='col-md-3'>
          <select className='form-control' value={type} onChange={(e) => { filterByType(e.target.value) }}>
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-4">
        {loading ? (
          <Loader />
        ) : (
          rooms.map(room => {
            return <div className='com-md-9'>
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>;
          })
        )}

      </div>
    </div>
  );
}

export default Homescreen;
