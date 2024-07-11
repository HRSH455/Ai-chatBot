import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form=document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent +='.';
    if (element.textContent = '....'){
      element.textContent = '';
    }
  },300)
}

function typeText(element,text){
  let i=0;
  let interval = setInterval(() =>{
    if(i<text.length){
      element.innerHTML += text.charAt(i);
      index++;
    }
    else{
      clearInterval(interval);
    }
     
  },20)
}

function generateuniqueid(){
  const timest = Date.now();
  const ranomNumber = Math.random();
  const hexaStirng = randomNumber.toString(16);
  return `id-${timest}-${hexaString}`;
}

function chatStripe(isAi,value,uniqueid){
  return (
    `
    <div class = "wrapper ${isAi && 'ai'}">
      <div class ="chat">
        <div className ="profile">
        <img src ="${isAi ? bot : user}"
             alt ="${isAi ? 'bot' : 'user'}"
        />
        </div>
        <div class = "message" id = ${uniqueid}>${value}</div>
      </div>
    </div>    
    `
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'));

  form.reset();
  const uniqueid = generateuniqueid();
  chatContainer.innerHTML += chatStripe(true," ",uniqueid);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueid);
  loader(messageDiv);
   const response = await fetch('https://codex-im0y.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim()  

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Failed in Fetching"
        alert(err)
    }
}
form.addEventListener('submit' , handleSubmit);
form.addEventListener('keyup',(e) =>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
} )
