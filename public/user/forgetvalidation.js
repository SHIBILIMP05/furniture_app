document.getElementById('sendEmail').addEventListener('click', function(e) {
  e.preventDefault()

  const email = document.getElementById("email").value;
  const message = document.getElementById('error-message')

  $.ajax({
    url: '/forget',
    data: {
      email: email
    },
    method: "post",
    success: (response) => {

      if (response.emailPatt) {
        message.style.display = "block";
        message.textContent = "Please enter the valid email address."
      } else if (response.email_require) {
        message.style.display = "block";
        message.textContent = "Please fill this field and submit again."
      } else if (response.email_space) {
        message.style.display = "block";
        message.textContent = "Email cannot contain spaces."
      } else if (response.mailverify) {
        message.style.display = "block";
        message.textContent = "Given mail is not verified."
      } else if (response.wrong) {
        message.style.display = "block";
        message.textContent = "This email is not registered."
      } else {
        // window.location.href = "/forgetpage"
        // message.style.display = "block";
        // message.textContent = "please check your mail."
        Swal.fire({
          title:"success",
          text:"Thank you for your action! We've sent an email to your registered email address. Please check your inbox for further instructions. If you don't receive the email within a few minutes, please try again.",
          icon:"success",
        
        })
      }

    },
  })

})