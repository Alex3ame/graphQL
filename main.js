
let userId = "";
let LS = localStorage

function clearLS(){
  LS.clear();
  checkLS();
}

//create login form
function checkLS(){
  //console.log(localStorage.length)
  if (localStorage.length == 0){
    document.getElementById('myForm').innerHTML= 
    '<h1>Enter your email and password</h1> <input type="text" name="login" id="login" placeholder="Login"></input> <input type="text" name="pass" id="pass" placeholder="Password"> <span onclick="signRequest()">Send</span>';
  }else{
    document.getElementById('myForm').innerHTML='<span onclick="clearLS()">Logout</span>';
    decodeToken();
  }
}
checkLS();


//decode token and get id
function decodeToken(){
  const [, payload] = LS.getItem("token").split('.');
  let decodeLS = JSON.parse(atob(payload));
  userId = decodeLS['sub'];
  console.log("UserId =", userId);
}



async function signRequest (){

let user = {
    email: document.getElementById('login').value,
    password: document.getElementById('pass').value
  };

  
  
  //console.log(user);
  let response = await fetch('https://01.kood.tech/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      "Authorization": 'Basic ' + btoa(`${user.email}:${user.password}`)
    },
    
  });

  //clear form
  const form = document.getElementById("myForm");
  form.reset();

  //error check
  if (response.ok != true){
    alert("Error HTTPS: " + response.status + " User does not exist or password incorrect")

  }else{
    let result = await response.json();
    LS == localStorage.setItem('token',result); 
    checkLS();
    
    //console.log(response.status);
    //alert(result.message);
  }
      
}


