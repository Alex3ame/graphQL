// function f1(){
//     //1. create object request
//     const xhr = new XMLHttpRequest();

//     //2. where to send and parameters
//     xhr.open('POST', 'https://01.kood.tech/api/auth/signin')
//     xhr.setRequestHeader('kirjalikud@gmail.com','ime22312')

//     //3. server response
//     xhr.onload = function () {
//         console.log (xhr.status);
//         console.log (xhr.response);
        
//     }
//     //4. send request
//     xhr.send();
// }

// f1(); 


// const formElement = documnt.getElementById('logsData'); // извлекаем элемент формы
// formElement.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const formData = new FormData(formElement); // создаём объект FormData, передаём в него элемент формы
//   // теперь можно извлечь данные
//   const name = formData.get('login'); 
//   const surname = formData.get('pass'); 
//   console.log(name,surname)
// });

async function signRequest (){

let user = {
    email: 'kirjalikud@gmail.com',
    password: 'ime911921'
  };
 
  console.log(user);
 let response = await fetch('https://01.kood.tech/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: new Headers( {
      "Authorization": 'Basic ' + btoa(`${user.email}:${user.password}`)
    }),
    
  });
let result = await response.json();
alert(result.message);

}
signRequest();


