//---------------------ADD PRODUCT VALIDATION-------------------------

document.getElementById('editProductsubmit').addEventListener('click',function(event){
    
    const name = document.getElementById('Name').value
    const price = document.getElementById('price').value
    const quantity = document.getElementById('quantity').value
    const description = document.getElementById('description').value

    const message = document.getElementById('error-message')

    if(price.trim() === "" && quantity.trim() == "" && description.trim() == ""){
        message.style.display = "block"
        message.textContent = "Must fillout all the fields."
        event.preventDefault()
      }else if(name.trim() == ""){
        message.style.display = "block"
        message.textContent = "Product name is required."
        event.preventDefault()
      }else if(price < 1){
        message.style.display = "block"
        message.textContent = "Price must be positive value."
        event.preventDefault()
      }else if(quantity < 1){
        message.style.display = "block"
        message.textContent = "Quantity must be positive value."
        event.preventDefault()
      }else if(description.length < 10){
        message.style.display = "block"
        message.textContent = "Description atleast 10 letters."
      }
})  