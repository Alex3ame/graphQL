let userId = "";
let LS = localStorage;
let JWTSplit
let JWT 
let username
let levelOffset = 0
let levelPoints = [[0, 60]]
let level = 0
let auditUp = 0
let auditDown = 0
let auditUpOffset = 0
let auditDownOffset = 0
let xpOffset = 0


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
    AuditUp();
    AuditDown();
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
              levelPoints.push([Math.round((Date.parse(result.data.transaction[i].createdAt) - Date.parse("2021-08-28T10:20:30.184449+00:00")) / (1000 * 60 * 60 * 24)), 60 - level])
          }
          document.getElementById("level").innerText = result.data.transaction.length
          drawLevelGraph()
      })
}


function AuditUp() {
  fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + `${JWT}`,
          },
          body: JSON.stringify({
              query: `
    {
      transaction(offset:${xpOffset}, where: { userId: { _eq: ${userId} } type: { _eq: "up"}} ) {
            amount
      }
  }
      `,
          }),
      })
      .then((res) => res.json())
      .then(function(result) {
          for (i = 0; i < result.data.transaction.length; i++) {
              auditUp += result.data.transaction[i].amount
          }
          auditUpOffset += 50
          if (result.data.transaction.length > 49) {
              setTimeout(() => {
                  AuditUp()
              }, "200")
          } else {
              drawAuditRatioGraph()
              document.getElementById("auditUp").innerText =  Math.round(auditUp/1000) + " kB"
          }
      })
}



function AuditDown() {
  fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + `${JWT}`,
          },
          body: JSON.stringify({
              query: `
    {
      transaction(offset:${auditDownOffset}, where: { userId: { _eq: ${userId} } type: { _eq: "down"}}) {
            amount
      }
  }
      `,
          }),
      })
      .then((res) => res.json())
      .then(function(result) {
          for (i = 0; i < result.data.transaction.length; i++) {
              auditDown += result.data.transaction[i].amount
          }
          auditDownOffset += 50
 
              drawAuditRatioGraph()
              document.getElementById("auditDown").innerText = Math.round(auditDown/1000) + " kB"
          
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

function drawAuditRatioGraph() {
  document.getElementById("auditRatio").innerHTML = `
<h1 style="border-width: 0px; position: absolute; margin-right: 230px">${Math.round(100*auditUp/(auditDown+auditUp))}%</h1>
<svg width="100%" height="100%" viewBox="0 0 42 42" class="donut">
<circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
<circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#FFFFFF" stroke-width="3"></circle>
<circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#000000" stroke-width="3" stroke-dasharray="${Math.round(100*auditDown/(auditDown+auditUp))} ${Math.round(100*auditUp/(auditDown+auditUp))}" stroke-dashoffset="25"></circle>
</svg>
<h1 style="border-width: 0px; position: absolute; color: #FFFFFF; margin-left: 230px">${Math.round(100*auditDown/(auditDown+auditUp))}%</h1>
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

