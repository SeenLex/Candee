import React from 'react'
import './style.css'

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.tsx'
import { loginData } from '../../types/UserType.ts'

import toast from 'react-hot-toast'
import LoginForm from '../../components/controls/form/loginForm.tsx'

const LoginPage: React.FC = () => {
const { login } = useAuth()
  const navigate = useNavigate()

  const imageSource = {
    User: "https://previews.123rf.com/images/uu777/uu7772004/uu777200400031/146833209-le-concept-de-l-enseignement-%C3%A0-domicile.jpg",
    Distributor: "https://previews.123rf.com/images/uu777/uu7772006/uu777200600013/149560612-concept-de-biblioth%C3%A8que-en-ligne-avec-de-petites-personnes-lisant-des-livres-e-learning.jpg",
    Admin: "https://previews.123rf.com/images/uu777/uu7772006/uu777200600013/149560612-concept-de-biblioth%C3%A8que-en-ligne-avec-de-petites-personnes-lisant-des-livres-e-learning.jpg"
  }
  const handleSubmit = async (data: loginData) => {
    try {
      await login(data)
      toast.success('Login successful')
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(`Login failed. ${error.message}`)
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
            <h2>Login In as User </h2>
          <LoginForm onSubmit={handleSubmit} />
         
        </div>
       
        <div className="auth-image">
            <NavLink to="/register/customer" className="auth-link">Don't have an account? Register</NavLink>
            <NavLink to="/register/distributor" className="auth-link">Distributor? Register here</NavLink>
        </div>
         
      </div>
    </div>
  )
}

export default LoginPage