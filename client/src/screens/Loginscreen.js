import React, {useState, useEffect} from 'react'
import axios from "axios";
import Loader from '../components/Loader';
import Error from '../components/Error';


function Loginscreen() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [error, seterror] = useState(); 
  const [loading, setloading] = useState(false); 


 async function Login(){
   
    const user = {
      email,
      password
    }
    try {
      setloading(true)
      const result = (await axios.post('/api/users/login' , user)).data
      setloading(false)
      localStorage.setItem('currentUser' , JSON.stringify(result));
      window.location.href='/home'

    } catch (error) {
      console.log(error)
      setloading(false)
      seterror(true)
    }

    }
  return (
    <div>
      {loading && (<Loader/>)}
        <div className="row justify-content-center mt-5">
          <div className="col-md-5 mt-5">
          {error && (<Error message='Invalid User Credentials' />)}

            <div className='bs'>
              <h2>Login</h2>
             
              <input type="text" className="form-control" placeholder="Please Enter Email"
               value={email} onChange={(e)=>{setemail(e.target.value)}}/>
              <input type="text" className="form-control" placeholder="Please Enter Password"
               value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<button className='btn btn-primary mt-3' onClick={Login}>Login</button>
            </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Loginscreen