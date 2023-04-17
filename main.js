// const form = document.getElementById('logsData');
//  function retrieveFormValue(event){
//      event.preventDefault();

//      const email = form.querySelector('[name="login"]'),
//        password = form.querySelector('[name="password,"]')

//     let user = {
//     email: email.value,
//     password: password.value 
//   };
//   console.log(user)
//  }
//  form.addEventListener('submit',retrieveFormValue)
//  retrieveFormValue();


// let formData = {};
// const form = document.querySelector('form');
// const LS =localStorage;
// form.addEventListener('input', function(event){
//     formData[event.target.name] = event.target.value;
//     LS.setItem('formData', JSON.stringify(formData));
//     console.log(LS)
// });


// function login(){
// let log = document.getElementById('login').value;
// let pass = document.getElementById('pass').value;

// //console.log(log,pass);
// }
// login();

async function signRequest (){
    let user = {
        email: document.getElementById('login').value,
        password: document.getElementById('pass').value
      };
     
      console.log(user);
     let response = await fetch('https://01.kood.tech/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: new Headers( {
          "Authorization": 'Basic ' + btoa(`${user.email}:${user.password}`)
        }),
        
      });
      //console.log("log= ",btoa(user.email),"pass= ",btoa(user.pass))
      //console.log(btoa(`${user.email}:${user.password}`))
    let result = await response.json();
    console.log(result);
    alert(result.message);
    }
    //signRequest();


