async function signUp(){
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password
        })
    }

    const response = await fetch("http://localhost:3000/user/signup", options);
    const responseJson = await response.json();
    if(response.status == 409){
        alert(responseJson.msg);
    }
    if(response.status == 400){
        alert(responseJson.errors.join("\n"));
    }
    else{
        window.location.href = "/Frontend/Signin/index.html"
    }

}

async function signIn(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        })
    }

    const response = await fetch("http://localhost:3000/user/signin", options);
    const responseJson = await response.json();
    
    if(response.status == 401){
        alert(responseJson.msg);
    }

    else{
        localStorage.setItem("token", responseJson.token);
        window.location.href = "/Frontend/Dashboard/index.html"
    }

}