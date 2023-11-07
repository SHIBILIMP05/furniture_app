document.getElementById('admin-log-submit').addEventListener('click',function(e){
    e.preventDefault()
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById('error-text');

    $.ajax({
        url:'',
        data:{
            email:email,
            password:password,
        },
        method:"post",
        success: (response)=>{

            if ((response.require)) {
                message.style.display = "block";
                message.textContent = "Must fillout all the fields."
              }else if(response.emailPatt){
                message.style.display = "block";
                message.textContent = "Enter the valid email address."
              }else if(response.emailnot){
                message.style.display = "block";
                message.textContent = " You can't get access in this email."
              }else if(response.wrongpass){
                message.style.display = "block";
                message.textContent = "  Incorrect password."
              }else if(response.notregister){
                message.style.display = "block";
                message.textContent = "  Mail not registered."
              }else{
                window.location.href = "/admin/home"
              }

        },
    })

})