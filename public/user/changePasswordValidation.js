document.getElementById('reset-password').addEventListener('click', function (e) {
    e.preventDefault()

    const password = document.getElementById("password").value
    const confirm = document.getElementById("confirm").value
    const password_message = document.getElementById('password-error');
    const confirm_message = document.getElementById('confirm-error');

    $.ajax({
        url: '/forget-password',
        data: {
            password: password,
            confirm: confirm,
        },
        method: "post",
        success: (response) => {

            if (response.password) {
                password_message.style.display = "block";
                password_message.textContent = "Password should contain numbers & alphabets."
            } else if (response.passlength) {
                password_message.style.display = "block";
                password_message.textContent = "Password must contain 4 digits."
            } else if (response.password_require) {
                password_message.style.display = "block";
                password_message.textContent = "Please fill this field and submit again."
            } else if (response.confirm_require) {
                confirm_message.style.display = "block";
                confirm_message.textContent = "Please fill this field and submit again."
            } else if (response.password_space) {
                password_message.style.display = "block";
                password_message.textContent = "Password cannot contain spaces."
            } else if (response.confirm_space) {
                confirm_message.style.display = "block";
                confirm_message.textContent = "Confirm password cannot contain spaces."
            } else if (response.wrong) {
                confirm_message.style.display = "block";
                confirm_message.textContent = "Confirm the correct password."
            } else {
                // window.location.href = "/forgetpage"
                // message.style.display = "block";
                // message.textContent = "please check your mail."
                Swal.fire({
                    title: "success",
                    text: "Password successfully changed.",
                    icon: "success",

                }).then((data)=>{
                    if(data){
                    window.location.href = "/login"
                    }
                    
                })
            }

        },
    })

})