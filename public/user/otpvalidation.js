

document.getElementById("otpSubmit").addEventListener('click',function(e){
e.preventDefault()

const otp =document.getElementById("otp").value
const message = document.getElementById("otp-error")

$.ajax({
    url:"/verifyOtp",
    data:{
        otp:otp
    },
    method:"post",
    success:(response)=>{
        if(response.wrong){
        message.style.display = "block";
        message.textContent = "Enter the valid OTP."
        }else if(response.fill){
        message.style.display = "block";
        message.textContent = "Please fill this field"
        }else if(response.error){
        message.style.display = "block";
        message.textContent = "Sorry , Got some technical issues, please enter the otp again."
        }else{
            const Toast = swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            })

            Toast.fire({
                icon: 'success',
                title: 'Your Furni Hub account is verified.'
              })

              setTimeout(()=>{
                window.location.href="/login"
              },3000)
        }
    }


})

})

var timeleft = 60

var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("timer").textContent = timeleft;
    const resendLink = document.getElementById("resendLink");
    const timeSpan = document.getElementById("timeSpan");

    if(timeleft <= 0){
        clearInterval(downloadTimer);
        resendLink.style.display = "block";
        timeSpan.style.display = "none";
    }else{
        document.getElementById("timer").textContent = timeleft;
    }
        
    },1000);