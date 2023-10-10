const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const Flight = require('../Model/flight');

router.post("/login", async (req, res) => {

    const { username, password } = req.body;
    try {

        if(username!="user"){
            return res.status(401).json({ message: 'Invalid Credentials' });
        }


        if (password!="userpass") {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ userId: "userID" }, 'your-secret-key');
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post("/verify",verifyToken, async (req, res) => {
    res.send("Verified")
})

router.post("/getlast10quotes", verifyToken, async (req, res) => {

    let FindDetails = await Flight.find().sort({ $natural: -1 }).limit(10)

    res.json({Flight: FindDetails})
})

router.post("/getallquotes", verifyToken, async (req, res) => {

    let FindDetails = await Flight.find().sort({ $natural: -1 })

    res.json({Flight: FindDetails})
})

router.post("/getquote",verifyToken, async (req, res) => {
    let id = req.body.id;
    let FindDetails = await Flight.find({_id: id}).sort({ $natural: -1 })

    res.json({Flight: FindDetails})
})


function verifyToken(req, res, next) {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      console.log(`Token Valid`);
      next();
    });

}

module.exports = router;
