const startButton = document.querySelector('.btn-start');
const stopButton = document.querySelector('.btn-stop');
const clickEvent = new Event("click");
const recognition = new webkitSpeechRecognition();
recognition.lang = 'en-US'; // Đặt ngôn ngữ cho nhận dạng giọng nói

const nutquat = document.getElementById("battatquat");

recognition.onresult = async function(event) {
  const result = event.results[event.results.length - 1][0].transcript;
  console.log(result); // In văn bản nhận dạng ra console

  const savedText = result.toLowerCase();
  console.log(savedText); // In văn bản lưu vào biến ra console
 // window.alert(savedText);
  const data = {
    homename: localStorage.getItem('homename'),
  };
    updateData("on", "living room",savedText,data,"ledphongkhach","toggleLiving");
    updateData("off", "living room",savedText,data,"ledphongkhach","toggleLiving");
    updateData("on", "bedroom",savedText,data,"ledphongngu","toggleBed");
    updateData("off", "bedroom",savedText,data,"ledphongngu","toggleBed");
    updateData("on", "kitchen",savedText,data,"ledphongbep","toggleKit");
    updateData("off", "kitchen",savedText,data,"ledphongbep","toggleKit");


    if(savedText.includes("fan on")){
        nutquat.click();
    }
    if(savedText.includes("fan off")){
      nutquat.click();
        }

    senddulieubattat(data);

};

// Sự kiện khi nhấn nút "Start"
startButton.addEventListener('click', function() {
    document.getElementById('batmic').style.display = 'block';
    document.getElementById('tatmic').style.display = 'none';
    
    recognition.start();
    
});

// Sự kiện khi nhấn nút "Stop"
stopButton.addEventListener('click', function() {
    document.getElementById('batmic').style.display = 'none';
    document.getElementById('tatmic').style.display = 'block';
  recognition.stop();
});


function updateData(action, room,savedText,data,truongdata,elementID) {

    

    if (savedText.includes(action)) {
      if (savedText.includes(room)) {
        data[truongdata] = action === "on" ? "bat" : "tat";
        document.getElementById(elementID).checked = action === "on" ? true : false ; 
        localStorage.setItem(elementID,document.getElementById(elementID).checked );
      }
    }
  }
