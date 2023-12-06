document.getElementById('editAddress').addEventListener('click',function(e){
    e.preventDefault()
console.log("1qefewrf32rf")
    const id = document.getElementById('userId').value;
    const page = document.getElementById('page').value;
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
                url: "/editBillingAddress",
                data: {
                  fullname: fullname,
                  mobile: phone,
                  email: addressEmail,
                  houseName: houseName,
                  city: city,
                  state: state,
                  pin: pin,
                  id:id
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
                      title: 'Billing address updated successfully.'
                    })
                    if(page === "account"){
                      setTimeout(() => {
                      window.location.href = "/account"
                    }, 3000);
                    }else if(page === "checkout"){
                      setTimeout(() => {
                        window.location.href = "/checkout"
                      }, 3000);
                    }
                    
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

