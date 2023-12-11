import React from 'react'
import { Link } from 'react-router-dom'
function Landingscreen() {
  return (
    <div className='row landing'>
        <div className='col-md-12 text-center'>
            <h3 style={{color: "pink" , fontSize: '150px'}}> FunNstay </h3>
            <h4  style={{color: 'white' , fontSize: '60px'}}> FunNstay : Hotel Booking Application</h4>
            <h1  style={{color: 'red'}}>
               Designers and Developers :
            </h1>
            <h1 style={{color:'white'}}>Harsh Parikh</h1>
            <h1 style={{color:'white'}}> Shaily Shah</h1>
            <h1 style={{color:'white'}}> Jilesh Patel</h1>
            
            <Link to='/register'>
                <button className='btn landingbtn' style={{color: 'black'}}> GET STARTED </button>
            </Link>
        </div>
    </div>
  )
}

export default Landingscreen