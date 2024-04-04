// Tạo các biến cần thiết
let mediaRecorder;
let chunks = [];

// Sự kiện khi nhấn nút "Bắt đầu"
document.getElementById('start-btn').addEventListener('click', function() {
  // Kiểm tra xem trình duyệt hỗ trợ MediaRecorder API hay không
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        // Tạo instance của MediaRecorder
        mediaRecorder = new MediaRecorder(stream);

        // Sự kiện khi có dữ liệu âm thanh được ghi lại
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        // Sự kiện khi ghi âm kết thúc
        mediaRecorder.onstop = function() {
          // Tạo một blob từ các chunks đã ghi lại
          let blob = new Blob(chunks, { type: 'audio/webm' });

          // Tạo một URL để tải xuống âm thanh
          let url = URL.createObjectURL(blob);

          // Tạo một thẻ audio để phát lại âm thanh
          let audio = document.createElement('audio');
          audio.controls = true;
          audio.src = url;

          // Thêm thẻ audio vào phần tử HTML
          document.body.appendChild(audio);
        };

        // Bắt đầu ghi âm
        mediaRecorder.start();
      })
      .catch(function(error) {
        console.log('Lỗi:', error);
      });
  }
});

// Sự kiện khi nhấn nút "Dừng"
document.getElementById('stop-btn').addEventListener('click', function() {
  // Dừng ghi âm
  mediaRecorder.stop();
});