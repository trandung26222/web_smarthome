var battatquat = document.getElementById('battatquat');


battatquat.addEventListener('click', () => toggleText());


function toggleText() {
    // Kiểm tra nếu text hiện tại là 'ON', thì chuyển thành 'OFF', và ngược lại
    battatquat.textContent = (battatquat.textContent === 'Đang bật') ? 'Đang tắt' : 'Đang bật';

    var sendReq = {
        homename: localStorage.getItem("homename"),
        quat: (battatquat.textContent === 'Đang bật')
    };
    guiDoor(sendReq);
}