import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import p3 from '../../images/p3.webp';

const Home = () => {
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

      <div className="home-container">
        <div className="left-side">
          <img alt="Doctors and patients" src={p3} />
        </div>
        <div className="right-side">
          <p>
            <span className="f-letter">Healthcare that moves</span>
            <br />
            <span className="s-letter">at the speed of your life.</span>
            <br />
            <span className="t-letter">
              Discover doctors, book visits, share reports and get seen on time — all in one vibrant, smart platform.
            </span>
            <br />
            <Button color="info" className="mt-3 register">
              <Link to={'/Login'}>Book your first visit</Link>
            </Button>
          </p>
        </div>
      </div>

      <Container className="pb-5">
        <h1 className="text-center mb-4" style={{ color: '#e5e7eb' }}>
          Why PulseWave Health?
        </h1>
        <div className="right-side">
          <p style={{ color: '#e5e7eb', opacity: 0.95 }}>
            PulseWave Health is your personal command center for care. Skip the phone queues and waiting rooms —
            find trusted doctors, choose your time, upload your medical documents, and track every appointment in a
            clean, modern dashboard.
            <br />
            <br />
            • Real-time booking with verified doctors  
            <br />
            • Transparent fees, timings and specializations  
            <br />
            • Document uploads for smarter consultations  
            <br />
            • Separate admin & doctor views for smoother clinic operations  
            <br />
            <br />
            Whether you&apos;re a patient, a doctor, or an admin, PulseWave Health brings everyone onto the same
            effortless flow — so you can focus on what really matters: better outcomes.
          </p>
        </div>
      </Container>
    </>
  );
};

export default Home;
