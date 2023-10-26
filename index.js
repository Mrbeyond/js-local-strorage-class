
function signUp(event){
  event.preventDefault();

  error.style.display = "none";
  error.innerHTML = "User already exists";
  success.style.display = "none";

  const target = event.target;

  const form = new FormData(target);
   
  const firstName = form.get("firstName")?.trim();
  const secondName = form.get("secondName")?.trim();
  const lastName = form.get("lastName")?.trim();
  const password = form.get("password")?.trim();
  const email = form.get("email")?.trim();

  if (!firstName || !lastName || !password || !email){
    error.innerHTML = "Well done o, agba hacker, we caught you, jeje fill the forms";
    error.style.display = "block";
    return
  }

  const savedUsers = localStorage.users;
  let allUsers = [];
  if(savedUsers){
    allUsers = JSON.parse(savedUsers)
  }
 
  const emailExist = allUsers.findIndex((user)=> user.email == email)
  if(emailExist > -1){
    error.style.display = "block";
    return
  }

  const data = {
    firstName,
    secondName,
    lastName,
    email,
    password
  };

   allUsers.push(data)
   console.log(allUsers);
   localStorage.users = JSON.stringify(allUsers);
   success.style.display = "block";

}



function login(event){
  event.preventDefault();
  error.style.display = "none"
  success.style.display = "none"
  const target = event.target;

  const form = new FormData(target)
  const email = form.get("email")?.trim();
  const password = form.get("password")?.trim();


  const savedUsers = localStorage.users;
  let allUsers = [];
  if(savedUsers){
    allUsers = JSON.parse(savedUsers)
  }
 
  const user = allUsers.find((user)=>{
    return user.email == email && user.password == password;
  })
  if(!user){
    error.style.display = "block";
    return
  }

  
  localStorage.currentUser = JSON.stringify(user);

  success.style.display = "block";
}

function showUserDetails(){
  const savedUser = localStorage.currentUser;
  if(!savedUser){
     alert("No user is found, going back to login")
     setTimeout(()=>{
      login.href = "./login.html";
     }, 5000)
     return
  }
  const user = JSON.parse(savedUser);
  console.log(user);

}
