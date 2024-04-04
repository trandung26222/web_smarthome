var urlthoitiet = "";

if (navigator.geolocation) {
    // Lấy tọa độ
    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;  // 20.9944576
        const longitude = position.coords.longitude;  // 105.8045952
        


        // Thay thế lat và lon trong URL với giá trị thực tế
         urlthoitiet = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=263b4356d4ee402a86c4ea7b0631f349&days=6`;
        //  urlthoitiet = `https://api.weatherbit.io/v2.0/history/subhourly?lat=${latitude}&lon=${longitude}&start_date=2023-11-20&end_date=2023-11-25&key=7279453561504f56b9958fac94d9b277`;

            console.log(urlthoitiet)
        // Bây giờ bạn có thể sử dụng urlthoitiet để gửi yêu cầu đến API thời tiết
        laythoitietdudoan(urlthoitiet);

    }, function(error) {
        // Xử lý lỗi nếu không thể lấy được vị trí
        console.error('Không thể lấy được tọa độ:', error.message);
    });
} else {
    console.error('Trình duyệt không hỗ trợ Geolocation.');
}

  
async function laythoitietdudoan(urlthoitiet) {
  try {
      const response = await fetch(urlthoitiet);
      const data = await response.json();


      const temperatureData = data.data.map(item => ({
        date: item.datetime,
        temperature: item.temp
      }));
      console.log('Dữ liệu nhiệt độ lịch sử:');
      console.log(temperatureData);


      if (data && data.data && data.data.length > 0) {
          // Bỏ qua ngày hiện tại và lấy dữ liệu từ ngày tiếp theo
          const dates = data.data.slice(1).map(day => day.valid_date);
          const formattedDates = dates.map(date => {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
        });
        
        console.log(formattedDates);
        
          const temperatures = data.data.slice(1).map(day => day.temp);

          drawChart(formattedDates, temperatures);



// Gọi hàm vẽ biểu đồ
      } else {
          console.error('Không có dữ liệu dự đoán nhiệt độ.');
      }
  } catch (error) {
      console.error('Lỗi khi gọi API thời tiết:', error.message);
  }
}


function drawChart(dates, temperatures) {
    const ctx = document.getElementById('chartDuBaoThoiTiet').getContext('2d');
    const chartDuBaoThoiTiet = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Dự Báo Nhiệt Độ (°C)',
                data: temperatures,
                backgroundColor: 'rgb(124, 180, 226)',
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 1,
                barThickness: 40
            }]
        },
        options: {
          scales: {
              x: {
                  grid: {
                      display: false // Tắt hiển thị lưới trục x
                  },
                  ticks: {
                    color: 'white' // Màu của trục hoành
                }
              },
              y: {
                  display: false, // Tắt hiển thị trục tung
                  grid: {
                      display: false // Tắt hiển thị lưới trục y
                  },
                  beginAtZero: true
              }
          },
          legend: {
            labels: {
                color: 'white' // Màu của chữ trong label
            }
        }
      }
      
      
    });
}
