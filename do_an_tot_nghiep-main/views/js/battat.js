
const ipESSP = "http://192.168.10.182";
const ipServerwebSmartHome = "http://192.168.10.25:5000/SmartHome";


function getlocaltoggle(nameid){
  var tmp = localStorage.getItem(nameid);
  tmp = JSON.parse(tmp);
  document.getElementById(nameid).checked = tmp;
}

getlocaltoggle("toggleLiving");
getlocaltoggle("toggleBed");
getlocaltoggle("toggleKit");



function handleToggleClick(elementId, dataKey) {
    
    document.getElementById(elementId).addEventListener("click", async (event) => {

    

    var audioGas = document.getElementById('mp3battatden');
    audioGas.volume = 0.7; 
    audioGas.play();
    
    const data = {
      homename: localStorage.getItem('homename'),
    };
    data[dataKey] = document.getElementById(elementId).checked  ? 'bat' : 'tat';
    localStorage.setItem(elementId,document.getElementById(elementId).checked);

    senddulieubattat(data);
    console.log(data);

    });
  }

  // Gọi hàm handleToggleClick cho từng toggle cần xử lý
  handleToggleClick("toggleLiving", "ledphongkhach");
  handleToggleClick("toggleBed", "ledphongngu");
  handleToggleClick("toggleKit","ledphongbep");



  async function senddulieubattat(data){
    try {
      const response = await fetch(ipServerwebSmartHome, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
      } else {
        throw new Error('Lỗi khi gửi dữ liệu');
      }
    } catch (error) {
      console.error(error);
      }
//    http://192.168.1.100
const formData = new URLSearchParams();
for (const [key, value] of Object.entries(data)) {
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
var currentDate = new Date();
if(currentDate.getHours() === 23 && currentDate.getMinutes() === 0 ){
  var data2134 = {"homename":"sm1","ledphongkhach":"tat"};
  senddulieubattat(data2134);
}
