import React from 'react'
import './style.css'
import { NavLink, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.tsx'
import { useNavigate } from 'react-router-dom'
import {registerDataCustomer,registerDataDistributor,userRole} from '../../types/UserType.ts'
import toast from 'react-hot-toast'
import RegisterForm from '../../components/controls/form/registerForm.tsx'


const RegisterPage: React.FC = () => {
  const { register } = useAuth()
  const{userRole} = useParams()


  const navigate = useNavigate()
  const handleSubmit = async (data: registerDataCustomer | registerDataDistributor) => {
    try {
      const result = await register({
        ...data,
        name: data.name ? data.name : data.first_name + ' ' + data.last_name,
        role: userRole as userRole
      })
      if(result)
      {
        toast.success('Registration successful')
        navigate('/')
      }
      else{
      toast.error('Registration failed')
      return
      }
  
    } catch (error) {
      console.error('Register failed:', error)
      toast.error(`Register failed. ${error.message}`)
    }
  }



  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title" >
          <a href="/" >
          Candee Shop
          </a>
          </h1>
        </div>
       <div className='auth-content'>
        <div className="auth-box">
          <h2>Sign Up as {userRole }</h2>
          <RegisterForm onSubmit={handleSubmit} userRole={userRole as userRole} />
        </div>
        <div className="auth-image">
          {
            userRole === 'customer' ?
            <>
            <p> <NavLink to="/login">Already have an account? Login</NavLink></p>
            <p> <NavLink to="/register/distributor">Register as Distributor</NavLink></p>
            </> : userRole=== 'distributor' ?
            <>
            <p><NavLink to="/login">Already have an account? Login</NavLink></p>
            <p> <NavLink to="/register/customer">Register as Customer</NavLink></p>
            </> 
            : 
            null
          }
        </div>
      </div>
    </div>
  )
}

export default RegisterPage