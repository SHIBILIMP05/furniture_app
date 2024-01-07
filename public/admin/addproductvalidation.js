//---------------------ADD PRODUCT VALIDATION-------------------------

document.getElementById('addproductsubmit').addEventListener('click',function(event){
    
    const name = document.getElementById('Name').value
    const price = document.getElementById('price').value
    const quantity = document.getElementById('quantity').value
    const description = document.getElementById('description').value

    const message = document.getElementById('error-message')
    const imageInput = document.getElementById('imageInput');
    const chosenFiles = document.getElementById('chosenFiles');
    if (imageInput.files.length === 0) {
      message.style.display = "block";
      message.textContent = "Please select image.";
      event.preventDefault();
      return;
  } else {
      message.style.display = "none";
      message.textContent = "";
  }

    if(price.trim() === "" && quantity.trim() == "" && description.trim() == ""){
        message.style.display = "block"
        message.textContent = "Please fill all the fields."
        event.preventDefault()
      }else if(name.trim() == ""){
        message.style.display = "block"
        message.textContent = "Product name is required."
        event.preventDefault()
      }else if(price < 1){
        message.style.display = "block"
        message.textContent = "Price should be positive value."
        event.preventDefault()
      }else if(quantity < 1){
        message.style.display = "block"
        message.textContent = "Quantity should be positive value."
        event.preventDefault()
      }else if(description.length < 10){
        message.style.display = "block"
        message.textContent = "Description should contain atleast 10 letters."
      }
})  