import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import { Button, Form } from 'react-bootstrap';
import photo1 from '../../images/photo1.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8001/api/user/login', user);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data.userData));
        message.success('Welcome back to PulseWave Health!');
        const isLoggedIn = JSON.parse(localStorage.getItem('userData'));
        const { type } = isLoggedIn;

        switch (type) {
          case 'admin':
            navigate('/adminHome');
            break;
          case 'user':
            navigate('/userhome');
            break;
          default:
            navigate('/login');
            break;
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary navbar">
        <Container fluid>
          <Navbar.Brand>
            <Link to={'/'}>PulseWave Health</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
            <Nav>
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Sign In</Link>
              <Link to={'/register'}>Get Started</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MDBContainer className="my-5">
        <MDBCard style={{ border: 'none' }}>
          <MDBRow style={{ background: 'rgba(15,23,42,0.9)', color: '#e5e7eb' }} className="g-0 border-none p-3">
            <MDBCol md="6">
              <MDBCardImage src={photo1} alt="login form" className="rounded-start w-100" />
            </MDBCol>

            <MDBCol md="6">
              <MDBCardBody className="d-flex mx-5 flex-column">
                <div className="d-flex flex-row mt-2 mb-5">
                  <span className="h1 fw-bold mb-0">Sign in to continue</span>
                </div>

                <Form onSubmit={handleSubmit}>
                  <label className="form-label" htmlFor="formControlLgEmail">
                    Email address
                  </label>
                  <MDBInput
                    style={{ margin: '5px auto' }}
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    id="formControlLgEmail"
                    type="email"
                    size="md"
                    autoComplete="off"
                  />
                  <label className="form-label" htmlFor="formControlLgPassword">
                    Password
                  </label>
                  <MDBInput
                    style={{ margin: '5px auto' }}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    id="formControlLgPassword"
                    type="password"
                    size="md"
                    autoComplete="off"
                  />
                  <Button className="mb-4 px-5 bg-dark" size="lg" type="submit">
                    Sign In
                  </Button>
                </Form>
                <p className="mb-5 pb-lg-2" style={{ color: '#cbd5f5' }}>
                  Don&apos;t have an account?{' '}
                  <Link to={'/register'} style={{ color: '#38bdf8' }}>
                    Create one now
                  </Link>
                </p>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default Login;
