document.getElementById('admin-log-submit').addEventListener('click',function(e){
    e.preventDefault()
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const emailMessage = document.getElementById('email-error')
    const passwordMessage = document.getElementById('password-error')
    $.ajax({
        url:'',
        data:{
            email:email,
            password:password,
        },
        method:"post",
        success: (response)=>{

            if ((response.require)) {
              emailMessage.style.display = "block";
              emailMessage.textContent = "Pleas fill this field."
              }else if(response.passrequire){
                passwordMessage.style.display = "block";
                passwordMessage.textContent = "Pleas fill this field."
              }else if(response.emailspace){
                emailMessage.style.display = "block";
                emailMessage.textContent = " Email can't contains spaces."
              }else if(response.passwordspace){
                passwordMessage.style.display = "block";
                passwordMessage.textContent = "password can't contains spaces."
              }else if(response.emailPatt){
                emailMessage.style.display = "block";
                emailMessage.textContent = "Enter the valid email address."
              }else if(response.emailnot){
                emailMessage.style.display = "block";
                emailMessage.textContent = " You can't get access in this email."
              }else if(response.wrongpass){
                passwordMessage.style.display = "block";
                passwordMessage.textContent = "  Incorrect password."
              }else if(response.notregister){
                emailMessage.style.display = "block";
                emailMessage.textContent = "  Mail not registered."
              }else{
                window.location.href = "/admin/home"
              }

        },
    })

})