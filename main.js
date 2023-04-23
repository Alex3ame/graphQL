
let userId = "";
let LS = localStorage;
let JWTSplit
let JWT 
let username

function clearLS(){
  LS.clear();
  checkLS();
  location.reload();
}

//create login form
function checkLS(){
  if (localStorage.length == 0){
    document.getElementById('myForm').innerHTML= 
    '<h1>Enter your email and password</h1> <input type="text" name="login" id="login" placeholder="Login"></input> <input type="text" name="pass" id="pass" placeholder="Password"> <span onclick="signRequest()">Send</span>';
  }else{
    document.getElementById('myForm').innerHTML='<span onclick="clearLS()">Logout</span>';
    decodeToken();
    JWT = LS.getItem("token");
    usersName();
  }
}
checkLS();
//console.log(JWT,JWTSplit)

//decode token and get id
function decodeToken(){
  JWTSplit = [, payload] = LS.getItem("token").split('.');
  let decodeLS = JSON.parse(atob(payload));
  userId = decodeLS['sub'];
  document.getElementById("userID").innerText = userId

}
//console.log(JWT)
async function usersName (){
  let response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + `${JWT}`,
      },
      body: JSON.stringify({
        query: `
        {
         
            user{
              login
            }
          
        }
        `,
          }),
    })
    let result = await response.json();
    //console.log(result.data.user[0].login)
    username = result.data.user[0].login
    document.getElementById("userName").innerText = username
};

async function signRequest (){

let user = {
    email: document.getElementById('login').value,
    password: document.getElementById('pass').value
  };

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
    
   //location.reload();
    checkLS();
  }     
}


