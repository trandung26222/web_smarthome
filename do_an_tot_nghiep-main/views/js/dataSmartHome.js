const urldataSM = 'http://192.168.10.25:5000/dataSmartHome';


setInterval(UpdateNewData,500);

var isguiroi = false;

async function UpdateNewData(){
  fetch(urldataSM, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(homename)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi gửi yêu cầu!');
      }
      return response.json();
    })
    .then(data => {
      data = data[0];


      if(data.rogas == true){ // co ro gas => hien thi canhbao
        if(isguiroi == false){
          isguiroi = true;
          const datasend = {
            to: '01685839848asd@gmail.com',
            subject: 'Thông báo từ HomeService',
            text: 'Gas bị rò rỉ. Hãy kiểm tra hệ thống gas!',
          };
          sendEmail(datasend);
          // window.alert("Gas đang rò rỉ");
        }
        var audioGas = document.getElementById('mp3canhbaogas');
        audioGas.volume = 0.3; 
        audioGas.play();
        document.getElementById('canhbaogas').style.display = 'block';
        document.getElementById('vienicongas').style.border = '3px solid rgba(213, 234, 52, 0.768)';
        document.getElementById('safegas').style.display = 'none';
      }
      else{
        isguiroi = false;
        document.getElementById('canhbaogas').style.display = 'none';
        document.getElementById('safegas').style.display = 'block';
        document.getElementById('vienicongas').style.border = '3px solid rgba(0, 255, 89, 0.768)';
      }

// ======================================================================================

      if(data.dooropen == true){
        document.getElementById('door_open').style.display = 'block';
        document.getElementById('door_close').style.display = 'none';
      }
      else{
        document.getElementById('door_open').style.display = 'none';
        document.getElementById('door_close').style.display = 'block';
      }
      if(data.light == true){
        document.getElementById('troisang').style.display = 'block';
        document.getElementById('troitoi').style.display = 'none';
        document.getElementById('troisangtoi').textContent = 'Trời sáng'
      }else{
        document.getElementById('troisang').style.display = 'none';
        document.getElementById('troitoi').style.display = 'block';        document.getElementById('troisangtoi').textContent = 'Trời tối'
      }

      if(data.quat == true){
        document.getElementById('battatquat').textContent = 'Đang bật';
        document.querySelector('.iconfan').classList.add('animate-spin');

      }else{
        document.getElementById('battatquat').textContent = 'Đang tắt';
        document.querySelector('.iconfan').classList.remove('animate-spin');

      }

      document.getElementById('temperature').textContent = data.nhietdo + "°C";
      document.getElementById('humidity').textContent = data.doam + "%";
      setGaugeValue(gaugeElement, (data.doam/100));
      document.getElementById('rain').textContent = data.haverain ? "Đang mưa" : "Không mưa";
      document.getElementById('comua').style.display = data.haverain ? 'block':'none';
      document.getElementById('khongmua').style.display = data.haverain ? 'none': 'block';
      updateButton("toggleLiving",data.ledphongkhach);
      updateButton("toggleBed",data.ledphongngu);
      updateButton("toggleKit",data.ledphongbep);

    })
    .catch(error => {
      console.error('Lỗi:', error);
    });
}


async function sendEmail( data ){

  fetch("http://localhost:5000/sendemail", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
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
}

function updateButton(elementId, value) {
  document.getElementById(elementId).checked = (value === "bat");
}

