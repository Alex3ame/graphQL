
let userId = "";
let LS = localStorage;
let JWTSplit
let JWT 
let username
let levelOffset = 0
let levelPoints = [[0, 60]]
let level = 0
let totalXP = 0
let xpOffset = 0
let points = []

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
    userLevel();
    userXP();
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

//get user level
function userLevel() {
  fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + `${JWT}`,
          },
          body: JSON.stringify({
              query: `
    {
      transaction(offset:${levelOffset}, order_by: {createdAt: asc} where: {type: {_eq: "level"} userId: {_eq: ${userId}} _not: {object: {type: {_eq: "exercise"}}} }){
        createdAt
        amount
      }
    }
      `,
          }),
      })
      .then((res) => res.json())
      .then(function(result) {
          for (i = 0; i < result.data.transaction.length; i++) {
              level = result.data.transaction[i].amount
              levelPoints.push([Math.round((Date.parse(result.data.transaction[i].createdAt) - Date.parse("2021-05-28T10:20:30.184449+00:00")) / (1000 * 60 * 60 * 24)), 60 - level])
          }
          document.getElementById("level").innerText = level
          drawLevelGraph()
      })
}

//get total XP
function userXP() {
  fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + `${JWT}`,
          },
          body: JSON.stringify({
              query: `
    {
      transaction(offset:${xpOffset}, where: { userId: { _eq: ${userId} } type: { _eq: "xp"}} order_by: {createdAt: asc}) {
            amount
            createdAt
      }
  }
      `,
          }),
      })
      .then((res) => res.json())
      .then(function(result) {
          for (i = 0; i < result.data.transaction.length; i++) {
              totalXP += result.data.transaction[i].amount
              points.push([Math.round((Date.parse(result.data.transaction[i].createdAt) - Date.parse("2021-05-28T10:20:30.24974+00:00")) / (1000 * 60 * 60 * 24)) * 10, totalXP / 1000])
          }
          document.getElementById("xp").innerText = totalXP
              drawXPGraph()
      })
}




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
    checkLS();
  }     
}

function drawXPGraph() {
  for (i = 0; i < points.length; i++) {
      points[i][1] = (totalXP / 1000) - points[i][1]
  }
  points.push([points[points.length - 1][0], totalXP / 1000])
  document.getElementById("xpOverTime").innerHTML = ` 
<svg id="xpGraph" width="100%" height="100%" viewBox="0 0 ${points[points.length-1][0]} ${points[points.length-1][1]} ">
<polyline fill="#008080" stroke="#000000" stroke-width="20" points=" ${points.join(" ")} "/>
</svg>
`
}

function drawLevelGraph() {
    levelPoints.push([Math.round(Date.now() - Date.parse("2021-09-17T15:13:44.184449+00:00")) / (1000 * 60 * 60 * 24), levelPoints[levelPoints.length - 1][1]])
    levelPoints.push([Math.round(Date.now() - Date.parse("2021-09-17T15:13:44.184449+00:00")) / (1000 * 60 * 60 * 24), 60])
    document.getElementById("levelOverTime").innerHTML = ` 
  <svg height="100%" width="100%" id="xpGraph" viewBox="0 0 ${levelPoints[levelPoints.length-1][0]} 60" preserveAspectRatio="none">
  <polyline fill="#008080" stroke="#000000" stroke-width="1" points="${levelPoints.join(" ")} "/>
  </svg>
  `
}

