function sendDataToServer() {
    var thoiGian = document.getElementById("thoiGian").value;
    var chonphong = document.querySelector(".chonphong").value;
    var chonbattat = document.querySelector(".chonbattat").value;

    var data = {
        homename: localStorage.getItem('homename'),
    };
    data[chonphong] = chonbattat;
    if(chonphong==='quat') data[chonphong] = chonbattat==='bat'? true:false;

    console.log(data);


    setTimeout(function() {
        senddulieubattat(data);
      }, thoiGian*1000); 
}