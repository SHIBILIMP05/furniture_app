
//------------------------USER PROFILE EDITING----------------------------

document.getElementById('submitBtn').addEventListener('click',function(e){
    e.preventDefault()
    const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const emailError = document.getElementById('emailError');
  const nameError = document.getElementById('nameError');
  const numberError = document.getElementById('numberError');
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const mobilePattern = /^\d{10}$/;
  const namePattern = /^[a-zA-Z\s]+$/;

  if(name.trim() === "" ){
    nameError.style.display = "block";
    nameError.textContent = "Name is required."
  }else if(phoneNumber.trim() == ""){
    numberError.style.display = "block";
    numberError.textContent = "Number is required."
  }else if(email.trim() === ""){
    emailError.style.display = "block";
    emailError.textContent = "Email is required."
  }else if(name.length <= 2){
    nameError.style.display = "block";
    nameError.textContent = "Name atleast contain 3 letters."
  }else if(!emailPattern.test(email)){
    emailError.style.display = "block";
    emailError.textContent = "Enter the valid Email Address."
  }else if(!mobilePattern.test(phoneNumber) || phoneNumber === "0000000000"){
    numberError.style.display = "block";
    numberError.textContent = "Enter the valid mobile numbers.(must contain 10 numbers)."
  }else if(!namePattern.test(name)){
    nameError.style.display = "block";
    nameError.textContent = "Name not contain any non letters."
  }else{
        Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Not now",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "/editProfile",
            data: {
              name: name,
              email: email,
              number: phoneNumber
            },
            method: "post",
            success: (response) => {
              if ((response.success)) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                })
                
                Toast.fire({
                  icon: 'success',
                  title: 'Profile updated successfully.'
                })
                setTimeout(() => {
                  $("#myForm").load("/account #myForm");
                }, 3000);
              }
            },
          });
        }
      });
  }
});

//--------------------------------PASSWORD CHANGING IN PROFILE-------------------------

document.getElementById('changePass').addEventListener('click',function(e){
    e.preventDefault()

    const newPass = document.getElementById('newPass').value;
    const currPass = document.getElementById('password').value;
    const conPass = document.getElementById('conPass').value;
    const passError = document.getElementById('newpassError');
    const conError = document.getElementById('conpassError');
    const currError = document.getElementById('currError');

    const alphanumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    
    if(currPass.trim() === ""){
      currError.style.display = "block";
      currError.textContent = "please fill this field."
    }else if(newPass.trim() === ""){
      passError.style.display = "block";
      passError.textContent = "please fill this field."
    }else if(conPass.trim() === ""){
      conError.style.display = "block";
      conError.textContent = "please fill this field."
    }else if(newPass.length < 4){
      passError.style.display = "block";
      passError.textContent = "Password contain atleast 4 digits."
    }else if(!alphanumeric.test(newPass)){
      passError.style.display = "block";
      passError.textContent = "Password should contain digits & alphabets."
    }else if(newPass != conPass){
      passError.style.display = "block";
      passError.textContent = "Confirm the correct password"
    }else{
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Not now",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "/changePassword",
            data: {
              newPass: newPass,
              currPass: currPass
            },
            method: "post",
            success: (response) => {
              if ((response.changed)) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                })
                
                Toast.fire({
                  icon: 'success',
                  title: 'Password changed.'
                })
                setTimeout(() => {
                  $("#passForm").load("/profile #passForm");
                }, 3000);
              }else if(response.wrongpass == true){
                currError.style.display = "block";
                currError.textContent = "Current password is incorrect."
              }else if(response.newPassSame == true){
                currError.style.display = "block";
                currError.textContent = "Use different Password,You can't use same."
              }
            },
          });
        }
      });
      
    }
  });

  //-------------------------ADDRESS VALIDATION IN PROFILE------------

  document.getElementById("multiAddress").addEventListener("click",function(e){
    e.preventDefault()

    const fullname = document.getElementById('fullname').value;
    const pin = document.getElementById('pin').value;
    const phone = document.getElementById('phone').value;
    const addressEmail = document.getElementById('addressEmail').value;
    const houseName = document.getElementById('houseName').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const fnameError = document.getElementById('fnameError');
    const pinError = document.getElementById('pinError');
    const phoneError = document.getElementById('phoneError');
    const addEmailError = document.getElementById('addEmailError');
    const houseError = document.getElementById('houseError');
    const cityError = document.getElementById('cityError');
    const stateError = document.getElementById('stateError');
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const mobilePattern = /^\d{10}$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const pincodePattern = /^\d{6}$/;

    if(fullname.trim() === "" ){
      fnameError.style.display = "block";
      fnameError.textContent = "Name is required."
    }else if(!namePattern.test(fullname)){
      fnameError.style.display = "block";
      fnameError.textContent = "Full name not contain any non alphabets."
    }else if(fullname.length < 3){
      fnameError.style.display = "block";
      fnameError.textContent = "Full name atleast contain 3 letters."
    }else if(pin.trim() == ""){
      pinError.style.display = "block";
      pinError.textContent = "Pincode is required."
    }else if(!pincodePattern.test(pin)){
      pinError.style.display = "block";
      pinError.textContent = "Enter the valid pincode."
    }else if(phone.trim() === ""){
      phoneError.style.display = "block";
      phoneError.textContent = "Phone number is required."
    }else if(!mobilePattern.test(phone) || phone === "0000000000"){
      phoneError.style.display = "block";
      phoneError.textContent = "Enter the valid Phone number (must contain 10 numbers)."
    }else if(addressEmail.trim() === ""){
      addEmailError.style.display = "block";
      addEmailError.textContent = "Email is required."
    }else if(!emailPattern.test(addressEmail)){
      addEmailError.style.display = "block";
      addEmailError.textContent = "Enter the valid email address."
    }else if(houseName.trim() === ""){
      houseError.style.display = "block";
      houseError.textContent = "House name is required"
    }else if(city.trim() === ""){
      cityError.style.display = "block";
      cityError.textContent = "City name is required"
    }else if(state.trim() === ""){
      stateError.style.display = "block";
      stateError.textContent = "State name is required"
    }else{
          Swal.fire({
          title: "Are you sure?",
          text: "You want to add these details?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "Not now",
        }).then((result) => {
          if (result.isConfirmed) {
            $.ajax({
              url: "/addBillingAddress",
              data: {
                fullname: fullname,
                mobile: phone,
                email: addressEmail,
                houseName: houseName,
                city: city,
                state: state,
                pin: pin,
              },
              method: "post",
              success: (response) => {
                if ((response.success)) {
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                  })
                  
                  Toast.fire({
                    icon: 'success',
                    title: 'Billing address added successfully.'
                  })
                  setTimeout(() => {
                    $("#addressReload").load("/account #addressReload");
                  }, 3000);
                }else{
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                  })
                  
                  Toast.fire({
                    icon: 'error',
                    title: 'Oops !! try again.'
                  })
                }
              },
            });
          }
        });
    }
  });

  //---------------DELETING ADDRESS FROME PROFILE---------------

  function removeAddress(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/removeAddress",
          data: {
            id: id,
          },
          method: "post",
          success: (response) => {
            if ((response.remove = true)) {
              $("#addressReload").load("/account #addressReload");
            }
          },
        });
      }
    });
  }
