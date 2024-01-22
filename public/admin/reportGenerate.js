// //==============report generation ===============
document.getElementById('pdf-format').addEventListener('click', function(){
    // Get the current URL
    const currentURL = window.location.href;
    // Split the URL by slashes
    const urlParts = currentURL.split('/');
    // Extract the last part of the URL
    const duration = urlParts[urlParts.length - 1];

    const pdfurl = document.getElementById("pdf-format")
    pdfurl.href=`/admin/reportDown?duration=${duration}&format=pdf`
})
//==============report generation excel format===============
document.getElementById('excel-format').addEventListener('click', function(){
    // Get the current URL
    const currentURL = window.location.href;
    // Split the URL by slashes
    const urlParts = currentURL.split('/');
    // Extract the last part of the URL
    const duration = urlParts[urlParts.length - 1];

    const excelurl = document.getElementById("excel-format")
    excelurl.href=`/admin/reportDown?duration=${duration}&format=excel`  
})