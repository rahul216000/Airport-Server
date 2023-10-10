const express = require("express");
const router = express.Router();
const path = require("path")
const fs = require('fs');
const mongoose = require('mongoose');
const EmailUser = require("../Messages/SendEmailForUser")

const DB = process.env.DATABASE;
mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => {
    console.log('Connected');
}).catch((e) => { console.log('Not connected' + e); })

const Flight = require('../Model/flight');

router.post("/get-quote", async (req, res) => {
    let flightinfo = req.body.flight;
    let contact = req.body.contact;
    let { Fname, Lname, Email, Phone, Prefereed, Note, date } = contact

    try {
        const sender = {
            email: 'francesca.smith@topjet.aero',
            name: `Your Quote Request - TopJet`,
        }

        let content = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
                /* Add inline styles for better email client compatibility */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    padding: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #dddddd;
                    text-align: center;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 18px;
                    color: #333;
                }
                p {
                    color: #555;
                }
                .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Dear ${Fname},</h1>
                <p>Thank you for choosing TopJet for your private charter inquiry - we are excited to assist you in planning your upcoming journey.</p>
                <p>Your dedicated jet expert will be in touch with you shortly. They will discuss your requirements in detail and present you with a range of options tailored to your preferences, schedule, and budget.</p>
                <p>In the meantime, if you have any immediate questions or additional information you'd like to share, please feel free to reply to this email or call us, and we'll be happy to assist you.</p>
                <p>We look forward to serving you and ensuring your private charter experience is nothing short of extraordinary.</p>
                <p>Safe travels and warm regards,</p>
                <p>The TopJet Team</p>
                <p> <img src="https://airport-server.onrender.com/Topjet-logo.jpeg" alt="Company Logo"></p>
                <p>+1 (561) TOPJET-1</p>
                <p>sales.us@topjet.aero</p>
                <p>www.topjet.aero</p>


            </div>
        </body>
        </html>
        `
        await EmailUser(sender, Email, `Private Jet Request - TopJet`, content)

        await SendQuoteRequestToAdmin(flightinfo, contact)

        await StoreFlightInfo(flightinfo, contact)

        res.send("Email Sent")
    } catch (error) {
        console.log(error);
        res.send("Error")
    }


})

router.get("/dashboard-data", async (req, res)=>{
    let data = await GetData();
    res.send(data)
})

router.get("/dashboard/allquotes", async (req, res)=>{
    let FindDetails = await Flight.find()
    res.send(FindDetails)
})

async function GetData(){

    let FindDetails = await Flight.find().sort({ $natural: -1 }).limit(10)

    return FindDetails

}

async function StoreFlightInfo(flightinfo, contact){
    let data = new Flight({
        contact: contact,
        flight: flightinfo
    })
    
    let save = await data.save()

}

async function SendQuoteRequestToAdmin(flightinfo, contact) {
    let { Fname, Lname, Email, Phone, Prefereed, Note, date } = contact
    const sender = {
        email: 'francesca.smith@topjet.aero',
        name: `${Fname} - New Quote Request`,
    }

    let HtmlData = ``
    for (let i = 0; i < flightinfo.length; i++) {
        let data = flightinfo[i]
        let way = data[0]

        if (way == "OneWay") {
            HtmlData += `<br><table>
            <p>${way}</p>
            <tr>
                <td>From</td>
                <td>${data[1]}</td>
            </tr>
            <tr>
                <td>To</td>
                <td>${data[2]}</td>
            </tr>
            <tr>
                <td>Date</td>
                <td>${data[3]}</td>
            </tr>
            <tr>
                <td>Time</td>
                <td>${data[4]}</td>
            </tr>
            <tr>
                <td>Passengers</td>
                <td>${data[5]}</td>
            </tr>
            
        </table>`
        } else {
            HtmlData += `<br><table>
            <p>${way}</p>
            <tr>
                <td>From</td>
                <td>${data[1]}</td>
            </tr>
            <tr>
                <td>To</td>
                <td>${data[2]}</td>
            </tr>
            <tr>
                <td>Date</td>
                <td>${data[3]}</td>
            </tr>
            <tr>
                <td>Time From</td>
                <td>${data[4]}</td>
            </tr>
             <tr>
                <td>Time To</td>
                <td>${data[5]}</td>
            </tr>
            <tr>
                <td>Passengers</td>
                <td>${data[6]}</td>
            </tr>
            
        </table>`
        }
    }




    let content = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            /* Add inline styles for better email client compatibility */
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #dddddd;
                text-align: center;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
            }
            img {
                max-width: 100%;
                height: auto;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                font-size: 18px;
                color: #333;
            }
            p {
                color: #555;
                font-size: 18px;
                color: #333;

            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Quote From ${Fname},</h1>
            

            <br>
            <table>
                <p>Contact Info</p>
                <tr>
                    <td>Name</td>
                    <td>${Fname} ${Lname}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>${Email}</td>
                </tr>
                <tr>
                    <td>Phone</td>
                    <td>${Phone}</td>
                </tr>
                <tr>
                    <td>Prefereed</td>
                    <td>${Prefereed}</td>
                </tr>
                <tr>
                    <td>Notes</td>
                    <td>${Note}</td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>${date}</td>
                </tr>
                
            </table>

            <br>
            <p>Flight Details</p>
            ${HtmlData}
        </div>
    </body>
    </html>
    `


    await EmailUser(sender, 'sales.us@topjet.aero', `${Fname} - New Quote Request from Topjet`, content)

}


module.exports = router;
