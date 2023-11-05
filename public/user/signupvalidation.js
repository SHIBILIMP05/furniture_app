//-------------SIGNUP VALIDATION---------------

document.getElementById('sign-btn-1').addEventListener('click',function(e){
    e.preventDefault()
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById('error-message');

    $.ajax({
        url:'/register',
        data:{
            name:name,
            email:email,
            number:number,
            password:password,
            confirmPassword:confirmPassword
        },
        method:"post",
        success: (response)=>{

            if ((response.require)) {
                message.style.display = "block";
                message.textContent = "Must fillout all the fields."
              }else if(response.emailPatt){
                message.style.display = "block";
                message.textContent = "Enter the valid email address."
              }else if(response.mobile){
                message.style.display = "block";
                message.textContent = "Enter valid mobile number."
              }else if(response.password){
                message.style.display = "block";
                message.textContent = "Password must contain 4 digits."
              }else if(response.emailalready){
                message.style.display = "block";
                message.textContent = " You already have an account please Log In."
              }else if(response.wrongpass){
                message.style.display = "block";
                message.textContent = " Confirm the correct password."
              }else if(response.notsaved){
                message.style.display = "block";
                message.textContent = "Uh-oh! Got some issues please try again."
              }else if(response.name){
                message.style.display = "block";
                message.textContent = " Name atleast contain 3 letters."
              }else{
                window.location.href = "/otp"
              }

        },
    })

})