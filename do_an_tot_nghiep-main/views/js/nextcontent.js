document.getElementById('nextContent').addEventListener('click',() => nextContent());

var cont1 = document.getElementById('content1');
var cont2 = document.getElementById('content2');


var idcontent = 0;


function nextContent(){
    idcontent ++;
    if(idcontent == 2){
        idcontent = 0;
    }
    if (idcontent == 0) {
        cont1.style.display = 'block';
        cont2.style.display = 'none';
      } else if (idcontent == 1) {
        cont1.style.display = 'none';
        cont2.style.display = 'block';
}
}