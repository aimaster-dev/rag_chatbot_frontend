/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBInput,
  MDBCardBody,
  MDBCheckbox,
  MDBContainer,
}
  from 'mdb-react-ui-kit';

import "../assets/css/core.min.css"
import "../assets/css/custom.css"
import bgImage from "../assets/image/background.jpg"
import { login, register, setHeader, setToken } from '../layouts/components/utils/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

  const [ email, setEmail] = useState('');
  const [ password, setPassword] = useState('');
  const [ setRemember ] = useState('');
  const [ name, setName] = useState('')
  const [ repassword, setRepassword] = useState('')
  const [ regFlag, setRegFlag] = useState(false)
  const navigate = useNavigate();

  const styles = {
    container: {
      background: '#022A3B',
      opacity: 0.9,
      border: '2px solid #69c0f1e3',
      paddingBottom: 32,
      maxWidth: 500
    },
    button: {
    backgroundColor: '#B9EC51',
    color: '#333333',
    width: '100%',
    height: '50px',
    fontSize: '20px',
    textTransform: 'capitalize',
    }
  }

  const handleClick = async () => {

    if (regFlag && (password !== repassword)) {
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name)return
  
    if (regFlag && !email) return

    if (regFlag && !emailRegex.test(email)) return

    if (!password) return
    
    if(!regFlag)
    {
      const response = await login({username:name, password})
      if(response.status === 200){

        setToken(response.data.access_token, response.data.refresh_token)
        setHeader()
        navigate('/index')
        
      
      } else if (response.status === 401) {
        toast('Invalid token, please relogin')
        console.log('Error 401')
      
      } else if (response.status === 403) {
        toast('Invalid token, please relogin')
        console.log('Error 403')
      }

    }else{
      const response = await register({username:name, email, password})
      if(response.status === 200){
        
        setRegFlag(false)
        toast('Successfully registred')
        navigate('/login')
      }
    }
  }

  const onChangePass = (e) => {

    setPassword(e.target.value);
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangeUser = (e) => {
    setName(e.target.value)
  }

  const onChangeRePass = (e) => {
    setRepassword(e.target.value)
  }

  const onRememberChecked = (e) => {
    setRemember(e.target.value);
  }

  const handleRegister = () => {
    setRegFlag(true)
  }

  return (

    <MDBContainer fluid className='p-4' style={{
      background: `url(${bgImage}) center/cover`,
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <MDBRow className='pt-20'>
        <MDBCol size='1' />
        <MDBCol className='flex'>
          <MDBCard style={ styles.container }>
            <MDBCardBody className='p-5 text-white' style={{
              opacity: 1
            }}>
              <div className='flex'>
              <h2 className='text-left mb-4' style={{ margin: '0px' }}> {regFlag ? 'Sign Up' : 'Sign In'} </h2></div>
              <MDBInput className='text-white' wrapperClass='mb-4 border-none' placeholder='Enter your Username' type='user' onChange={onChangeUser} />
              {regFlag ? (<MDBInput className='text-white' wrapperClass='mb-4 border-none' placeholder='Enter your email'  type='email' onChange={onChangeEmail} />) : (<></>)}
              <MDBInput className='text-white' wrapperClass='mb-4' placeholder='Enter your password'  type='password' onChange={onChangePass} />
              {regFlag ? (<MDBInput className='text-white' wrapperClass='mb-4' placeholder='Check your password'  type='password' onChange={onChangeRePass} />) : (<div className='d-flex justify-content-left mb-4'>
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember Me' onClick={onRememberChecked} defaultChecked />
              </div>)}

              <MDBBtn style={ styles.button } onClick={handleClick} className='hover-zoom'>{regFlag ? ('Sign Up') : ('Sign In')}</MDBBtn>
              {
                !regFlag ? (<div className='pt-3 flex flex-row'>
                  <p className='text-white'>Not a member? </p>
                  <a id="register" style={{ color: "#5CCBF7" }} onClick={handleRegister}>Create Account</a>
                </div>) : (<></>)
              }
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol size='1' />
      </MDBRow>
      <ToastContainer/>
    </MDBContainer>
  );

}

export default Login;