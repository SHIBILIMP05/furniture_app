
//----------------load admin-------------------

const loadAdmin = async(req,res)=>{
    try {
        res.render("admin")
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = {
    loadAdmin
}