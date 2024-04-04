
const url = 'http://localhost:5000/datachart';
var homename = { homename: localStorage.getItem("homename") };

var chartType = 'bar';
var ctx = document.getElementById('barChart').getContext('2d');
var myChart;
var labelChart;
var dataChart;
var changechart = document.getElementById('changechart');


changechart.addEventListener('click', async function() {
  if(chartType == 'bar'){
  chartType = 'line';
  document.getElementById('chartIcon').classList.replace('fa-chart-line', 'fa-chart-simple');
  
  }
  else{
  chartType = 'bar';
  document.getElementById('chartIcon').classList.replace('fa-chart-simple', 'fa-chart-line');
  }
  if(myChart){
    myChart.destroy();
  }
  createChart();
  });



fetch(url, {
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
    var tmp323 = data[data.length -1];
    var sumTien ;
    var consumption = Math.floor((data.pop() *0.06));
    console.log(consumption);
    if (consumption >= 0 && consumption <= 50) {
      sumTien = Math.floor(consumption * 1678 );
    } else if (consumption > 50 && consumption <= 100) {
      sumTien = Math.floor(consumption * 1734 );
    } else if (consumption > 100 && consumption <= 200) {
      sumTien = Math.floor(consumption * 2014 );
    } else if (consumption > 200 && consumption <= 300) {
      sumTien = Math.floor(consumption * 2536 );
    } else if (consumption > 300 && consumption <= 400) {
      sumTien = Math.floor(consumption * 2834 );
    } else if (consumption > 400) {
      sumTien = Math.floor(consumption * 2927 );
    } else {
      sumTien = 0;
    }
    
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const dinhDangTienTe = formatter.format(sumTien).replace(/^(\D+)/, '');
    var chuoiSauKhiBo = dinhDangTienTe.replace(".00", "");
    chuoiSauKhiBo = chuoiSauKhiBo.replaceAll(",","."); 
    document.getElementById("tongtien").textContent = chuoiSauKhiBo + "  ";

    console.log(isLastDayOfMonth(currentDate)  && isTime8AM(currentDate));
    if(isLastDayOfMonth(currentDate)){
      var datasend = {
        to: '01685839848asd@gmail.com',
        subject: 'Thông báo từ HomeService',
        text: 'Tổng tiền điện tháng này : ' + chuoiSauKhiBo + " vnđ" + ". Thời gian sử dụng điện tháng này : " + tmp323 + " giờ."
      };
      sendEmail(datasend);
       datasend = {
        to: '01685839848asd@gmail.com',
        subject: 'Thông báo từ HomeService',
        text: 'Bạn nên đổi mật khẩu mỗi tháng 1 lần!',
    };
    sendEmail(datasend);
    }

      

    var monthcur = data.pop();
    var daycur = data.pop();

    const labels = [];
    for (let i = daycur-4 ; i <= daycur ; i++ ) {
      labels.push(`${i}/${monthcur}`);
    }
    labelChart = labels;
    dataChart = data;
    
   
    createChart();
    

  })
  .catch(error => {
    console.error('Lỗi:', error);
  });

  

  function createChart() {
    myChart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labelChart,
        datasets: [{
          label: 'Điện năng tiêu thụ (h)',
          data: dataChart,
          backgroundColor: '#87c1f4',
          borderColor: '#fefefe',
          borderWidth: 1
        }]
      },
      options: optionChart,
    });
  }



var optionChart = {
  responsive: false,
    scales: {
      y: {
        display:false,
        beginAtZero: true,grid: {display: false}
      },
      x:{  grid:{display:false} ,  
      ticks: {
        color: 'white', // Màu trắng cho số trên trục hoành
        font: {
        weight: 'bold' // In đậm số trên trục hoành
        }
        }  
    }
    },
    plugins: {
    tooltip: {
    callbacks: {
    label: function(context) {
      var value = context.parsed.y || 0;
      return   value;},
      title: function() {
        return null; // Tắt hiển thị phần tiêu đề tooltip
      }
    
    }},
    legend:{display:false},
    title: {display: true,text: 'Điện năng tiêu thụ (h)',color:'white',font:{size:18,weight:'bold',family:'Tilt Neon'}},
    }
};


function isLastDayOfMonth(date) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return date.getDate() === lastDay;

}

function isTime8AM(date) {
  return date.getHours() === 8 && date.getMinutes() === 0 ;
}