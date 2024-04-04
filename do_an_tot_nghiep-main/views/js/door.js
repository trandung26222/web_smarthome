var openButton = document.getElementById('buttonop');
var closeButton = document.getElementById('buttoncl');





openButton.addEventListener('click', () => openDoor());

closeButton.addEventListener('click', () => closeDoor());




function openDoor() {
    openButton.classList.add('clicked');
    closeButton.classList.remove('clicked');
    console.log(openButton.classList.contains('clicked')); 

    console.log('Door opened');
    document.getElementById('door_open').style.display = 'block';
    document.getElementById('door_close').style.display = 'none';
    var sendReq = { homename: localStorage.getItem("homename") ,
                dooropen : true
    };
    var audio = document.getElementById('mocuamp3');
    audio.volume = 0.5; 
    audio.play();
    guiDoor(sendReq);
}

function closeDoor() {
  closeButton.classList.add('clicked');
  openButton.classList.remove('clicked');
  console.log('Door closed');
  var audio = document.getElementById('dongcuamp3');
  audio.volume = 0.1; 
  audio.play();
  document.getElementById('door_open').style.display = 'none';
  document.getElementById('door_close').style.display = 'block';

  var sendReq = { homename: localStorage.getItem("homename") ,
                dooropen : false
    };
    guiDoor(sendReq);
}




async function guiDoor(sendReq){
    fetch('http://localhost:5000/SmartHome/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendReq)
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

        const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(sendReq)) {
        formData.append(key, value);
      }

      try {
        const response = await fetch(ipESSP, {
          method: 'POST',
          mode: 'no-cors' ,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });

      } catch (error) {
        console.error(error);
        }
}


