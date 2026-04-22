const path = require("path")
const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const port = 8080;
const { createPool } = require('mysql');


const pool = createPool({
    host: "localhost",
    user: "root",
    password: "0907",
    database: "wonderla",
    connectionLimit: 10
})


const WonderLand = path.join(__dirname, "/WonderLand")
app.use(express.static(WonderLand))
app.use(express.json())




// MAIL SENDER
app.post('/email', (req, res) => {
    console.log("data - ")
    const data = req.body;
    console.log(data)


    const wonderlaEmail = "wonderla@gmail.com"
    const wonderlaEmailPassword = "wonderlaEmailPassword"


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: wonderlaEmail,
            pass: wonderlaEmailPassword
        }
    });

    var mailOptions = {
        from: req.body.name + " " + req.body.email,
        to: 'myfriend@yahoo.com',
        subject: 'Wonderla Theme Park',
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

})




app.post('/checkOut', (req, res) => {
    const data = req.body;

    var sqlInsertQuery = `INSERT INTO people(name, date, AP, WP, APWP, APE, WPE, APWPE, email, phone)
                                  VALUES(
                                  "${req.body.name}", 
                                  "${req.body.date}", 
                                  "${req.body.ticks.AmusementPark}", 
                                  "${req.body.ticks.WaterPark}", 
                                  "${req.body.ticks.AmusementParkAndWaterPark}", 
                                  "${req.body.ticks.AmusementParkExpressTicket}", 
                                  "${req.body.ticks.WaterParkExpressTicket}", 
                                  "${req.body.ticks.AmusementParkAndWaterParkExpress}", 
                                  "${req.body.email}", 
                                  "${req.body.phone}"
                                  );`;



    pool.query(sqlInsertQuery, (err, result, field) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log(result);
        }
    })


})



app.get('/admin', (req, res) => {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let tDate = year + "-" + month + "-" + date;
    console.log(tDate);

    var sqlInsertQuery = `SELECT * FROM people WHERE date="${tDate}";`;
    pool.query(sqlInsertQuery, (err, result, field) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log(result);

            function toObject(arr) {
                var rv = {};
                for (var i = 0; i < arr.length; ++i)
                    if (arr[i] !== undefined) rv[i] = arr[i];
                return rv;
            }

            let data = toObject(result);

            console.log(data);
            res.status(200).send(JSON.stringify(data))
        }
    })



})









app.post('/logIn', (req, res) => {
    const data = req.body;
    const userName = `admin`
    const userPassword = `admin1234`

    if (userName == data.user && userPassword == data.pass) {
        console.log("success")
        res.send({ "staus": 'ok' })
    }
    else {
        console.log("fail")
        res.send({ "staus": 'fail' })
    }
})

















app.listen(port, () => {
    console.log(`Server Listening at - ${port}`);
})




// var sqlInsertQuery = `INSERT INTO people(name, date, AP, WP, APWP, APE, WPE, APWPE, email, phone)
//                                   VALUES(
//                                   "${req.body.name}", 
//                                   "${req.body.date}", 
//                                   "${req.body.ticketsAmusementPark}", 
//                                   "${req.body.ticketsWaterPark}", 
//                                   "${req.body.ticketsAmusementParkAndWaterPark}", 
//                                   "${req.body.ticketsAmusementParkExpressTicket}", 
//                                   "${req.body.ticketsWaterParkExpressTicket}", 
//                                   "${req.body.ticketsAmusementParkAndWaterParkExpress}", 
//                                   "${req.body.email}", 
//                                   "${req.body.phone}"
//                                   );`;

















// CREATE TABLE people(
//     name varchar(255),
//     date varchar(255),
//     AP varchar(255),
//     WP varchar(255),
//     APWP varchar(255),
//     APE varchar(255),
//     WPE varchar(255),
//     APWPE varchar(255),
//     email varchar(255),
//     phone varchar(255)
// );


// sudo service mysql start



// INSERT INTO people(name, date, AP, WP, APWP, APE, WPE, APWPE, email, phone)
// VALUES("name", "date", "AP", "WP", "APWP", "APE", "WPE", "APWPE", "email", "phone");
