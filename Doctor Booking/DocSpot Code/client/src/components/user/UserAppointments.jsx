import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const UserAppointments = () => {
  const [userid, setUserId] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserId(user._id);
      setIsDoctor(Boolean(user.isdoctor));
    } else {
    
      setUserId(null);
      setIsDoctor(false);
    }
  }, []);


  useEffect(() => {
    if (!userid) return;

    if (isDoctor) {
      getDoctorAppointment();
    } else {
      getUserAppointment();
    }
    
  }, [userid, isDoctor]);

  const getUserAppointment = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8001/api/user/getuserappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          userId: userid,
        },
      });
      if (res.data.success) {
        setUserAppointments(res.data.data || []);
  
      } else {
        setUserAppointments([]);
     
      }
    } catch (error) {
      console.error('getUserAppointment error:', error);
      message.error('Something went wrong while fetching your appointments');
      setUserAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorAppointment = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8001/api/doctor/getdoctorappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          userId: userid,
        },
      });
      if (res.data.success) {
        setDoctorAppointments(res.data.data || []);
    
      } else {
        setDoctorAppointments([]);
   
      }
    } catch (error) {
      console.error('getDoctorAppointment error:', error);
      message.error('Something went wrong while fetching doctor appointments');
      setDoctorAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (useridParam, appointmentId, status) => {
    try {
      const res = await axios.post(
        'http://localhost:8001/api/doctor/handlestatus',
        {
          userid: useridParam,
          appointmentId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
   
        if (isDoctor) {
          getDoctorAppointment();
        } else {
          getUserAppointment();
        }
      } else {
        message.error(res.data.message || 'Could not update status');
      }
    } catch (error) {
      console.error('handleStatus error:', error);
      message.error('Something went wrong while updating status');
    }
  };

  const handleDownload = async (docPath, appointId) => {
    try {
      if (!docPath) {
        message.error('No document available for this appointment');
        return;
      }
      const res = await axios.get('http://localhost:8001/api/doctor/getdocumentdownload', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { appointId },
        responseType: 'blob',
      });

      if (res.data) {
        const blob = new Blob([res.data]);
        const fileUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute('href', fileUrl);


        const fileNameFromPath = typeof docPath === 'string' ? docPath.split('/').pop() : `document-${appointId}`;
        downloadLink.setAttribute('download', fileNameFromPath);
        downloadLink.style.display = 'none';
        downloadLink.click();
        downloadLink.remove();
        window.URL.revokeObjectURL(fileUrl);
      } else {
        message.error('File not found on server');
      }
    } catch (error) {
      console.error('handleDownload error:', error);
      message.error('Something went wrong while downloading the file');
    }
  };

  return (
    <div>
      <h2 className="p-3 text-center">All Appointments</h2>
      <Container>
        {loading && <p>Loading...</p>}

        {isDoctor ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Appointment</th>
                <th>Phone</th>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments && doctorAppointments.length > 0 ? (
                doctorAppointments.map((appointment) => {
                  const doc = appointment.document || null;
                  return (
                    <tr key={appointment._id}>
                      <td>{appointment.userInfo?.fullName || 'N/A'}</td>
                      <td>{appointment.date || 'N/A'}</td>
                      <td>{appointment.userInfo?.phone || 'N/A'}</td>
                      <td>
                        {doc ? (
                          <Button
                            variant="link"
                            onClick={() => handleDownload(doc.path, appointment._id)}
                          >
                            {doc.filename || 'Download'}
                          </Button>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>No document</span>
                        )}
                      </td>
                      <td>{appointment.status}</td>
                      <td>
                        {appointment.status === 'approved' ? (
                          <></>
                        ) : (
                          <Button
                            onClick={() =>
                              handleStatus(appointment.userInfo?._id || userid, appointment._id, 'approved')
                            }
                          >
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <Alert variant="info">
                      <Alert.Heading>No Appointments to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Date of Appointment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments && userAppointments.length > 0 ? (
                userAppointments.map((appointment) => {
                  return (
                    <tr key={appointment._id}>
                      <td>{appointment.docName || 'N/A'}</td>
                      <td>{appointment.date || 'N/A'}</td>
                      <td>{appointment.status || 'N/A'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>
                    <Alert variant="info">
                      <Alert.Heading>No Appointments to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;
