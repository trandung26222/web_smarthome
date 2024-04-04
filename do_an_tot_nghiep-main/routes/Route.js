const express = require('express')
const router = express.Router();


const {

    newSmartHome,
    firstPage,
    login,renderLogin,newUser,DataChart,dataSmartHome,

    homepage,Smart_Home,sendEmail,
    resetpassword
    
     } = require('../controllers/Controller');

     

router.get('/',homepage);
router.post('/login',login);
router.post('/newUser',newUser);


router.get('/login',renderLogin);
router.post('/dataSmartHome',dataSmartHome);
router.post('/datachart',DataChart);
router.post('/newSmartHome',newSmartHome);
router.post('/SmartHome',Smart_Home);
router.post('/sendemail',sendEmail);
router.post('/resetpassword',resetpassword);

module.exports = router;