import React from 'react'
import { Button, Form, Input, message } from 'antd'
import '../styles/login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'



const Login = () => {

  const navigate = useNavigate()  // use for navigate like after register to login
  const dispatch = useDispatch()

  // form handler
  const onfinishhandler = async (values) => {

    try {

      dispatch(showLoading()) // jb tak load nahi hua hai tb tk spinner se load logo aayega
      const res = await axios.post('http://localhost:8000/api/login', values)

      window.location.reload();

      dispatch(hideLoading())

      if (res.data.success) {

        localStorage.setItem("token", res.data.data.token)
        message.success("login Successful");
        console.log(res.data.data.token);
        navigate('/')
      }
      else {
        message.error(res.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error);
      message.error("something went wrong");
    }
  }

  return (
    <>
      <div className="form-container">
        <Form layout='vertical' onFinish={onfinishhandler} className='card p-2 register-form'>

          <h3 className='text-center'>Login Form</h3>

          <Form.Item label='Email' name='email'>
            <Input type='email' autoComplete='email' required></Input>
          </Form.Item>

          <Form.Item label='password' name='password'>
            <Input type='password' autoComplete='current-password' required></Input>
          </Form.Item>

          <Link to='/register' className='ms-2 '>New user, Register here</Link>

          <Button className='btn btn-primary' htmlType='submit'>Login</Button>

        </Form>
      </div>
    </>
  )
}

export default Login