// Lấy ngày hiện tại
var currentDate = new Date();

// Lấy giá trị ngày, tháng và năm
var day = currentDate.getDate();
var month = currentDate.toLocaleString('default', { month: 'long' });
var year = currentDate.getFullYear();

// Gán giá trị ngày, tháng và năm vào các phần tử <p>
var dayElement = document.getElementById("currentDay");
dayElement.textContent =   day;

var monthElement = document.getElementById("currentMonth");
monthElement.textContent =   month;


var yearElement = document.getElementById("currentYear");
yearElement.textContent = "-" +  year +"-";








