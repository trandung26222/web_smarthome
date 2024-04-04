const User = require('../models/userModels');
const SmartHome = require('../models/Smarthome');
const DataHome = require('../models/DataHome');

const axios = require('axios');
const url = 'http://192.168.10.182'; // URL cần gửi yêu cầu GET
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


const cron = require('node-cron');
async function scheduleTask() {
  cron.schedule('0 23 * * *', () => {
    performAsyncTask();
  }, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh'
  });
}
async function performAsyncTask() {
}
scheduleTask();


async function resetpassword(req,res){
  const user = await User.find();
  try {
    const bodyString = JSON.stringify(req.body);
    const filteruser = user.filter((item) => {return item.homename == req.body.homename && item.username == req.body.username;});
    if(filteruser.length ===1) {
      const randomString = randomstring.generate(5);
      const datasend = {
        to: filteruser[0].email,
        subject: 'Yêu cầu reset password',
        text: 'Mật khẩu mới của bạn là ' + randomString + ". Hãy đăng nhập lại!",
      };

      await User.findOneAndUpdate({ username: filteruser[0].username , homename:filteruser[0].homename }, { password: randomString });

            fetch("http://localhost:5000/sendemail", {     //================================================
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datasend)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Có lỗi xảy ra khi gửi yêu cầu!');
            }
            return response.json();
          })
          
          .catch(error => {
            console.error('Lỗi:', error);
          });
          res.status(200).json("đã reset mật khẩu");

          }                                             //================================================

          else{
            res.status(400).json("username hoặc homename không tồn tại");
          }

  } catch (error) {
    console.error(error);
  }
}



async function sendEmail(req,res) {
  try {

    console.log(req.body);
    const transporter = nodemailer.createTransport({     // to subject text 
      service: 'gmail',  
      auth: {
        user: '0168583lol@gmail.com',
        pass: 'brgmkutzxzhtqodw',
      },
    });
    const mailOptions = {
      from: '0168583lol@gmail.com',
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(200).json("đã gửi email");

  } catch (error) {
    console.error(error);
  }
}










const firstPage = async(req,res) =>{  // get
  try {
    
    res.status(200).render('index');
     
  } catch (error) {
     res.status(500).json({ message: error.message });
 
  }
 }


const homepage = async(req,res) =>{  // get
  try {
    
    res.status(200).render('home');
    
     
  } catch (error) {
     res.status(500).json({ message: error.message });
 
  }
 }




var giobatquat;
 var ngayhientai ; var tmpTime;
 const Smart_Home = async (req, res) => { // post
  const smarthome = await SmartHome.find();
  const bodyString = JSON.stringify(req.body);
  console.log(bodyString); 
  try {
    if(bodyString.includes("homename")  && bodyString.includes("change0")){
      const filterHome = smarthome.filter((item) => {
        return item.homename == req.body.homename && item.password == req.body.password;
      });
      const message = filterHome.length === 1 ? 'Mật khẩu chính xác' : 'Mật khẩu sai rồi';
      res.status(200).json({ message });
    }
    if(bodyString.includes("homename") && bodyString.includes("change1")){
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { password: req.body.password });
      res.status(200).json({ message: 'Mật khẩu đã đổi' });
    }
    if(bodyString.includes("idcard")){
      const filteritem = smarthome.filter((item) => {return item.homename == req.body.homename && item.idcard == req.body.idcard;});
      const message = filteritem.length === 1 ? 'Thẻ chính xác' : 'Thẻ sai rồi';
      res.status(200).json({ message });
    }


//=====================================================xu ly du lieu dieu khien================

    var  filterItem = smarthome.filter((item) => {return item.homename == req.body.homename });
    if(filterItem.length == 1 && filterItem[0].ledphongkhach=="tat" && bodyString.includes("ledphongkhach") && bodyString.includes("bat")){
      getCurrentDate();
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { ledphongkhach: "bat", starttimeLiving:tmpTime} );
      res.status(200).json({ message: 'Đã bật đèn phòng khách'  });
    }
    if(filterItem.length ==1 && filterItem[0].ledphongkhach=="bat" && bodyString.includes("ledphongkhach") && bodyString.includes("tat")){
      tmpTime = new Date();await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { ledphongkhach: "tat"} );var UseTime = Math.floor((tmpTime-filterItem[0].starttimeLiving)/1000); 
      filterdatahome_sumtime(res,req,UseTime,'da tat den phong khach');
    }

// ===============================================================================================

    filterItem = smarthome.filter((item) => {return item.homename == req.body.homename });
    if(filterItem.length ==1 && filterItem[0].ledphongngu == "tat" && bodyString.includes("ledphongngu") && bodyString.includes("bat")){
      getCurrentDate();await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { ledphongngu: "bat", starttimeBed :tmpTime} );res.status(200).json({message:'da bat den phong ngu'});
    }
    if(filterItem.length ==1 && filterItem[0].ledphongngu == "bat" && bodyString.includes("ledphongngu") && bodyString.includes("tat")){
      tmpTime = new Date();await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { ledphongngu: "tat"} );var UseTime = Math.floor((tmpTime - filterItem[0].starttimeBed) / 1000);
      filterdatahome_sumtime(res,req,UseTime,'da tat den phong ngu');
    }
// =================================================================================================

    filterItem = smarthome.filter((item) => {return item.homename == req.body.homename });
    if(filterItem.length ==1 && filterItem[0].ledphongbep == "tat" && bodyString.includes("ledphongbep") && bodyString.includes("bat")){
      getCurrentDate();await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { ledphongbep: "bat", starttimeKitchen :tmpTime} );res.status(200).json({message:'da bat den phong bep'});
    }
    if(filterItem.length ==1 && filterItem[0].ledphongbep == "bat" && bodyString.includes("ledphongbep") && bodyString.includes("tat")){
      tmpTime = new Date();await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { ledphongbep: "tat"} );var UseTime = Math.floor((tmpTime - filterItem[0].starttimeKitchen) / 1000);
      filterdatahome_sumtime(res,req,UseTime,'da tat den phong bep');
    }
// =================================================================================================

    if(bodyString.includes("dooropen")){
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { dooropen: req.body.dooropen });
      res.status(200).json('da dieu khien cua ');
    }
// =================================================================================================
    if(bodyString.includes("nhietdo") && bodyString.includes("doam")){
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { nhietdo: req.body.nhietdo ,doam: req.body.doam });
      res.status(200).json("nhiet do va do am ok");
    }
// =================================================================================================
    if(bodyString.includes('haverain')){
      var tmp = req.body.haverain ==1 ? false :true;
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { haverain: tmp  });
      res.status(200).json({ haverain: tmp  });    }
// =================================================================================================
    if(bodyString.includes('rogas')){
       
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { rogas : req.body.rogas  });
      res.status(200).json({ rogas : req.body.rogas  });    }

// =================================================================================================
    if(bodyString.includes('quat')){
      if(bodyString.includes("true")){
        giobatquat = new Date();
        getCurrentDate();
      }
      if(bodyString.includes("false")){
        var giohientai = new Date();
        var UseTime = Math.floor((giohientai - giobatquat) / 1000);
        console.log(UseTime);
        filterdatahome_sumtime(res,req,UseTime,"da cap nhat");

      }
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { quat : req.body.quat  });
      res.status(200).json({ quat : req.body.quat  });    }
// =================================================================================================
    if(bodyString.includes('light')){
              
      await SmartHome.findOneAndUpdate({ homename: req.body.homename }, { light : req.body.light  });
      res.status(200).json({ light : req.body.light  });    }
//   ================================================================================================
    

    

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



function getCurrentDate() {
  ngayhientai = new Date();
  ngayhientai = ngayhientai.getDate() + "/" + (ngayhientai.getMonth()+1) + "/" + ngayhientai.getFullYear();
  tmpTime = new Date();
}
async function filterdatahome_sumtime(res,req,UseTime,message){
  const datahome = await DataHome.find(); 
  filterItem = datahome.filter((item) => {return item.homename == req.body.homename && item.ngaythangnam == ngayhientai; });
      if(filterItem.length == 0){
        await DataHome.create({
          homename : req.body.homename , ngaythangnam : ngayhientai , thoigianbat : UseTime,})
      }
      else{
        var tmp = filterItem[0].thoigianbat + UseTime;await DataHome.findOneAndUpdate({homename : req.body.homename , ngaythangnam : ngayhientai},{thoigianbat:tmp})
      }
      res.status(200).json(req.body.dooropen);
}



const newSmartHome = async (req, res) => { // post
  try {
    const newHome = new SmartHome({
      homename : req.body.homename,
      password : req.body.password,
      starttimeLiving : req.body.starttimeLiving,
      endtime : req.body.endtime,
      ledphongkhach : req.body.ledphongkhach,
      address    : req.body.address,
      ledphongngu :req.body.ledphongngu,
      ledphongbep : req.body.ledphongbep,
      dooropen   : req.body.dooropen,
      rogas   : req.body.rogas,
      quat : req.body.quat,
    });
    console.log(newHome);
    SmartHome.create(newHome);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const newUser = async (req, res) => { 
  try {
    const newuser = new User({
      username : req.body.username,
      password : req.body.password,
      homename : req.body.homename,
    });
    console.log(newuser);
    User.create(newuser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const DataChart = async(req,res) =>{
  try {
    const datahome = await DataHome.find(); // su dung de filter tim kiem 
    
    var ngayhientai1 = new Date();
    var month =  (ngayhientai1.getMonth()+1);
    var iday = ngayhientai1.getDate();
    var thangnam = "/" + (ngayhientai1.getMonth()+1) + "/" + ngayhientai1.getFullYear();
    var tmpDay = iday + thangnam;

    var numbers = [];
    var sumTime = 0;


    for(let i = 0 ; i<5 ;i ++){
      var filterItem = datahome.filter((item) => {return item.homename == req.body.homename && item.ngaythangnam == tmpDay; });
      if(filterItem.length == 1){
        numbers.push(filterItem[0].thoigianbat);
        sumTime += filterItem[0].thoigianbat;
      }
      else{
        await DataHome.create({
          homename : req.body.homename , ngaythangnam : tmpDay , thoigianbat : 0,})
      }
      iday--;
      tmpDay = iday + thangnam;
    }
    
    for(let i = 1 ;i<=iday;i++){
      tmpDay = i + thangnam;
      var filterItem = datahome.filter((item) => {return item.homename == req.body.homename && item.ngaythangnam == tmpDay; });
      if(filterItem.length == 1){
        sumTime += filterItem[0].thoigianbat;
      }
    }
    numbers.reverse();
    numbers.push(iday+5);numbers.push(month);numbers.push(sumTime);
  res.status(200).json(numbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







const renderLogin = async(req,res) =>{ 
  try {
    
    
     res.render('login',{check : null});
  } catch (error) {
     res.status(500).json({ message: error.message });
 
  }
 }


  const login = async(req,res)=>{  
    try {
        const user = await User.find();
        console.log(req.body);

        const filteredUser = user.filter((item) => {
         return item.username == req.body.username &&
          item.password == req.body.password && 
          item.homename == req.body.homename;
       });
       if(filteredUser.length == 1){
        res.status(200).json({ message: 'Mật khẩu chính xác ok' });
       }
       else{
        res.status(400).json({ message: 'Mật khẩu không chính xác' });  
       }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 


  const dataSmartHome = async(req,res)=>{  
    try {
      const smarthome = await SmartHome.find();
      var  filterItem = smarthome.filter((item) => {return item.homename == req.body.homename });
      res.status(200).json(filterItem);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 







  module.exports  = {
    
    newSmartHome,
    firstPage,
    login,renderLogin,newUser,DataChart,dataSmartHome,

    homepage,Smart_Home ,sendEmail,
    resetpassword
  }

//   const bcrypt = require('bcrypt');

// const password = 'myPassword';

// // Tạo băm mật khẩu
// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   // Lưu trữ hash mật khẩu vào cơ sở dữ liệu
//   console.log('Hashed password:', hash);

//   // Kiểm tra mật khẩu đã băm với mật khẩu nhập vào
//   bcrypt.compare('wrongPassword', hash, (err, result) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     if (result) {
//       console.log('Password is correct');
//     } else {
//       console.log('Password is incorrect');
//     }
//   });
// });


//    ledphongkhach : bat   & homename : sm1 