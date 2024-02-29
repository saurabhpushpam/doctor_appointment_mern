import React from 'react'
import { Button, Form, Input, message } from 'antd'
import '../styles/register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'



const Register = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // form handler
  const onfinishhandler = async (values) => {
    try {

      dispatch(showLoading())
      const res = await axios.post('http://localhost:8000/api/register', values)
      dispatch(hideLoading())

      if (res.data.success) {
        message.success("Register Successfully");
        navigate("/login");
      }
      else {
        message.error(res.data.msg)
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

          <h3 className='text-center'>Register Form</h3>

          <Form.Item label='name' name='name'>
            <Input type='text' autoComplete='name' required></Input>
          </Form.Item>

          <Form.Item label='Email' name='email'>
            <Input type='email' autoComplete='email' required></Input>
          </Form.Item>

          <Form.Item label='password' name='password'>
            <Input type='password' autoComplete='current-password' required></Input>
          </Form.Item>

          <Link to='/login' className='ms-2 '>Already register login here</Link>

          <Button className='btn btn-primary' htmlType='submit'>Register</Button>

        </Form>
      </div>
    </>
  )
}

export default Register