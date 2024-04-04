document.getElementById('nextRoom').addEventListener('click',() => nextRoom());
var livingroom = document.getElementById('denphongkhach');
var bedroom = document.getElementById('denphongngu');
var kitchen = document.getElementById('denphongbep');
var idRoom = 0;


function nextRoom(){
    idRoom ++;
    if(idRoom == 3){
        idRoom = 0;
    }
    
    if (idRoom === 0) {
        livingroom.style.display = 'block';
        bedroom.style.display = 'none';
        kitchen.style.display = 'none';
      } else if (idRoom === 1) {
        livingroom.style.display = 'none';
        bedroom.style.display = 'block';
        kitchen.style.display = 'none';
      } else if (idRoom === 2) {
        livingroom.style.display = 'none';
        bedroom.style.display = 'none';
        kitchen.style.display = 'block';
      }
}