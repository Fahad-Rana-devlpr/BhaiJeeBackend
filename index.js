const express = require('express');
const jwt = require('jsonwebtoken');
const csvdata = require('./src/Schema/csvdata.js')
require('./src/databaseConn/conn.js')
const login = require('./src/Schema/login.js')
const loginDetails = require('./src/Schema/loginDetails.js')
const cors = require('cors')
const multer = require('multer');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage });
const secretKey = 'jfdsm_zxncjk#%jfds1234<,>dhfdkmn%a@fdf!';
app.post('/logindata', async (req, res) => {
    console.log('loginForm')
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({ message: "Unsuccess", data: 'Please Enter the username and password' })
        }
        const response = await login.findOne({ username: username });
        if (username === response?.username && password === response?.password) {
            const user = {
                username,
                password
            }
            const token = jwt.sign(user, secretKey, { expiresIn: '1m' });
            const findUsername = await loginDetails.findOne({ username });

            return res.json({ message: "Success", data: token })
        } else {
            return res.json({ message: 'Unsuccess', data: 'Your username or password is Incorrect' })
        }

    } catch (error) {
        return res.json({ message: "unSuccess", data: error })
    }
})
app.get('/home', async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    console.log('i am in home')
    try {
        const response1 = await csvdata.find();
        console.log(response1)
        return res.json({ message: "success", data: response1 })
    } catch (err) {
        return res.json({ message: "unSuccess", data: err })
    }
})



// Handle POST request for file upload
app.post('/uploadfile', upload.single('file'), async (req, res) => {
    console.log('uploadFile')
    const uploadedFile = req.file;
    if (!uploadedFile) {
        return res.status(400).send('No file uploaded');
    }
    let workbook;
    try {
        workbook = xlsx.read(uploadedFile.buffer, { type: 'buffer' });
    } catch (error) {
        console.error('Error reading XLSX file:', error);
        return res.status(500).send('Error reading XLSX file');
    }
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    const parsedData = data.map(row => {
        const extractRegistrationNumber = String(row.RegistrationNo).trim();
        if (extractRegistrationNumber === undefined || extractRegistrationNumber === '-' || extractRegistrationNumber === '') {
            return null;
        }
        if (extractRegistrationNumber != 'undefined' || extractRegistrationNumber != '-') {
            let parts = extractRegistrationNumber.split('-');
            let beforeDash, betweenDash, afterDash, numericPart1;
            if (parts?.length === 3) {
                beforeDash = parts[0] || '';
                betweenDash = parts[1] || '';
                numericPart1 = parts[2] || '';
            }
            if (parts?.length === 2) {
                beforeDash = parts[0] || '';
                betweenDash = '';
                numericPart1 = parts[1];
            }
            const variable = (numericPart1 || '').replace(/[^\d]/g, '');
            afterDash = (variable)?.padStart(4, '0');

            return {
                reqtxt: beforeDash || '',
                reqbtw: betweenDash || '',
                reqNo: afterDash || '',
                brnd: row.BRND || '',
                dpd: row.DPD || '',
                bank: row.BANK || ''
            };

        }
    }).filter(entry => entry !== null);
    let filterdData = parsedData.filter((data) => data.reqNo != '0000')

    //   Save the parsed data to MongoDB
    try {
        filterdData.map(async (data) => {
            const uploadData = new csvdata(data)
            await uploadData.save();
        })
        return res.status(200).send('Data saved to MongoDB');
    } catch (error) {
        return res.status(500).send('Error saving data to MongoDB');
    }


});

app.listen((3001), () => {
    console.log(`server is listning on port number ${PORT}`)
})

