// import Layout from 'antd/es/layout/layout'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Row } from "antd";
import DoctorList from "../components/DoctorList";


const Homepage = () => {

  const [doctors, setDoctors] = useState([]);

  // login userdata
  const getuserdata = async () => {

    try {
      // const res = await axios.post("http://localhost:8000/api/getuserbyid", {},
      const res = await axios.get("http://localhost:8000/api/getAllDoctor",
        //  {},
        {
          headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            Authorization: localStorage.getItem("token"),
          }
        });

      console.log(res.data.data.name);
      console.log(res.data.data.email);

      if (res.data.success) {
        setDoctors(res.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getuserdata()
  }, [])


  return (
    <>
      <Layout>
        <h1 className="text-center">Home Page</h1>
        <Row>
          {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
        </Row>
      </Layout>
    </>
  )
}

export default Homepage