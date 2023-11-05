document.getElementById('log-btn-1').addEventListener('click', function(e){
    e.preventDefault()
    const email = document.getElementById('exampleInputEmail1').value;
    const password = document.getElementById('exampleInputPassword1').value;
    const message = document.getElementById('myAlert1')

    $.ajax({
        url: "/login",
        data: {
          email: email,
          password: password
        },
        method: "post",
        success: (response) => {
          if ((response.register)) {
            message.style.display = "block";
            message.textContent = " This account is not registered please register."
          }else if(response.wrong){
            message.style.display = "block";
            message.textContent = " Wrong password."
          }else if(response.logemailPatt){
            message.style.display = "block";
            message.textContent = " Invalid Email."
          }else if(response.blocked){
            message.style.display = "block";
            message.textContent = "You can't access this account."
          }else if(response.success){
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
            })
            
            Toast.fire({
              icon: 'success',
              title: 'Welcome to Furni Hub.'
            })
            setTimeout(() => {
              window.location.href = "/home"
            }, 2000);
           
          }else if(response.verify){
            window.location.href = "/otp"
          }
        },
      });
})