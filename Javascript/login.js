function Validate()
{
    let userid = document.getElementById("userID").value;
    let password = document.getElementById("password").value;
    if(userid == "admin" && password == "admin")
    {
        alert("Login Successful.")
        window.open('../Home.html');
    }
    else
    {
        alert("Login Failed.");
    }

}