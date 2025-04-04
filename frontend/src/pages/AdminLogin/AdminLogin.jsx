import React, { useState } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/token';
import api from '../../api'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {login} from '../../Redux/actions/authActions'

const AdminLogin = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    
    const handleSubmit = async (e) => {
      setLoading(true)
      e.preventDefault()
      
      const data = {email,password}
      console.log('Clicked')
      console.log(data);
      
      try{
        const res = await api.post('/api/admin/login/', data)
        console.log('APi res : ', res.data);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem('admin', JSON.stringify({ is_superuser: res.data.is_superuser }));
        dispatch(login(res.data))
  
        
        alert('Admin login successful');
        navigate('/adminhome')
      }catch(error){
        alert('error')
        console.log(error)
      } finally{
        setLoading(false)
      }
    }
  
    
  
    
    return (
      <div>
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Admin Login</h2>
            <div>
              <label>Email:</label>
              <input
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
                type="email"
                name="email"
                required
                className="input"
                placeholder="Email"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                required
                className="input"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
      </div>
    )
  }
  
  export default AdminLogin