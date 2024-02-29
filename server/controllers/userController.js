const user = require("../models/userModel");
const userModel = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const bcryptjs = require('bcryptjs');
const bcrypt = require("bcryptjs");

const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

const config = require("../config/config");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const randomstring = require("randomstring");



const create_token = async (userid) => {

    try {

        const token = await jwt.sign({ id: userid }, process.env.JWT_SECRET);
        return token;

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    }
    catch (error) {

        res.status(400).send(error.message);

    }
}

const register_user = async (req, res) => {


    try {

        const pswd = req.body.password;
        // const cpswd = req.body.confirmpassword;


        const spassword = await securePassword(req.body.password);

        const users = new user({
            name: req.body.name,
            email: req.body.email,
            password: spassword,

        });



        const mail = req.body.email;
        const validEmail = /\S+@\S+\.\S+/.test(mail);
        if (!validEmail) {
            res.status(200).send({ success: false, msg: "invalid email form" });
        }

        else {

            const userData = await user.findOne({ email: req.body.email });
            if (userData) {
                res.status(200).send({ success: false, msg: "This email is already exist" });

            }
            else {


                const user_data = await users.save();
                res.status(200).send({ success: true, data: user_data });

            }
        }


    }

    catch (error) {


        res.status(400).send(error.message);
    }

}

//login Method

const user_login = async (req, res) => {

    const { email, password } = req.body;

    console.log('Received login request:', { email, password }); // Debugging log
    try {

        const isEmail = /\S+@\S+\.\S+/.test(email);

        // Check if the 'email' or 'mobile' is provided
        if (!isEmail && !phone) {
            return res.status(400).json({ msg: 'Email or mobile number is required' });
        }

        // Find the user based on email or mobile number
        let userData;

        // Find the user based on email or mobile number
        if (isEmail) {
            userData = await user.findOne({ email });
        } else {
            userData = await user.findOne({ phone });
        }

        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }


        /*
        
                const email = req.body.email;
                const phone = req.body.phone;
                const password = req.body.password;
        
        
        
                const userData = await user.findOne({
                    $or: [{ email: email }, { phone: phone }]
                });
               
        
        */
        if (userData) {

            const passwordmatch = await bcryptjs.compare(password, userData.password);


            if (passwordmatch) {

                const tokenData = await create_token(userData._id);
                // const id = await userData._id;
                // const savetoken = await user.updateOne({ _id: id }, { $push: { tokens: tokenData } });


                const userResult = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    token: tokenData

                }

                const response = {
                    success: true,
                    msg: "User Details",
                    data: userResult
                }

                res.status(200).send(response);

            }
            else {
                res.status(200).send({ success: false, msg: "login details are incorrect" });
            }

        }
        else {
            res.status(200).send({ success: false, msg: "login details are incorrect" });
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}


const getuser = async (req, res) => {
    try {

        const data = await user.find();
        const formattedData = data.map(item => ({

            id: item._id,
            name: item.name,
            email: item.email,
            isDoctor: item.isDoctor,

            password: item.password,

        }));

        // Send the formatted data as the response
        // res.status(200).json(formattedData);

        res.status(400).send({ success: "true", data: formattedData });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// getuserbyid and getiduser are same

const getiduser = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: "user not found",
                success: false,
            });
        } else {
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "auth error",
            success: false,
            error,
        });
    }
};


const getuserbyid = async (req, res) => {
    try {

        const userdata = await user.findById({ _id: req.body.userId });
        // const userdata = await user.findOne({ _id: req.body.userId });
        // req.body.userId token se aa raha hai, it contain id of valid user

        userdata.password = undefined; // user ko password nahi dikhega
        if (!userdata) {
            return res.status(200).send({
                msg: "user not found",
                success: false
            })
        }
        else {
            res.status(200).send({
                success: true,
                data: userdata
                // data: { name: userdata.name, email: userdata.email }
            })
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

// APpply DOctor CTRL
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: "pending" });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;
        // console.log("object");
        // console.log(adminUser);
        // console.log(adminUser.notification);
        // console.log(notification);
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/docotrs",
            },
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied SUccessfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error WHile Applying For Doctotr",
        });
    }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const seennotification = user.seennotification;
        const notification = user.notification;
        seennotification.push(...notification);
        user.notification = [];
        user.seennotification = notification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in notification",
            success: false,
            error,
        });
    }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;   // isse screen pr password display nahi hoga
        res.status(200).send({
            success: true,
            message: "Notifications Deleted successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "unable to delete all notifications",
            error,
        });
    }
};

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).send({
            success: true,
            message: "Doctors Lists Fetched Successfully",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errror while Fetching Doctor",
        });
    }
};

//BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: "New-appointment-request",
            message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Book succesfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
};

// booking bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm")
            .subtract(1, "hours")
            .toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not Availibale at this time",
                success: true,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Booking",
        });
    }
};

const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        });
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In User Appointments",
        });
    }
};



module.exports = {

    register_user,
    user_login,
    getuser,
    getiduser,
    getuserbyid,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDocotrsController,
    bookeAppointmnetController,
    bookingAvailabilityController,
    userAppointmentsController,



}