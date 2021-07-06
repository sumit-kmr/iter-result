const hideLoader = () => {
    document.getElementById('login-btn').style.display = "block";
    document.getElementById('loader').style.display = "none";
}

const showLoader = () => {
    document.getElementById('login-btn').style.display = "none";
    document.getElementById('loader').style.display = "block";
}

const hideResult = () => {
    document.getElementById('result-container').style.display = "none";
    document.getElementById('login-form').style.display = "block";
}

const showResult = () => {
    document.getElementById('result-container').style.display = "block";
    document.getElementById('login-form').style.display = "none";
}

const showLoaderResult = () => {
    document.getElementById('loader-result').style.display = "block";
}

const hideLoaderResult = () => {
    document.getElementById('loader-result').style.display = "none";
}

const fillInputFields = () => {
    const savedUsername = localStorage.getItem('uname');
    const savedPassword = localStorage.getItem('pass');
    if (savedPassword && savedUsername) {
        document.getElementById("input-username").value = savedUsername;
        document.getElementById("input-password").value = savedPassword;
    }
}

fillInputFields();

let username = "";
let password = "";
let sem = "";

const login = (event) => {
    event.preventDefault();
    username = document.getElementById("input-username").value;
    password = document.getElementById("input-password").value;
    sem = document.getElementById("select-sem").value;
    showLoader();
    fetch('https://us-central1-iterapi.cloudfunctions.net/getDetailedResult?uname=' + username + '&pass=' + password + '&sem=' + sem)
        .then(res => res.json())
        .then(data => {
            document.getElementById('result-body').innerHTML = "";
            
            if (data.status === "success") {
                fetch('https://us-central1-iterapi.cloudfunctions.net/getResult?uname=' + username + '&pass=' + password)
                    .then(res => res.json())
                    .then(data2 => {
                        let currSgpa = 0;
                        data2.data.data.forEach(ele => {
                            if (ele.stynumber === parseInt(sem)) {
                                currSgpa = ele.sgpaR;
                            }
                        });
                        localStorage.setItem('uname', username);
                        localStorage.setItem('pass', password);
                        document.getElementById('select-sem-result').value = sem;
                        data.data.Semdata.forEach(ele => {
                            document.getElementById('result-body').innerHTML += `
                                <tr>
                                    <td>${ele.subjectcode}</td>
                                    <td>${ele.subjectdesc}</td>
                                    <td>${ele.earnedcredit}</td>
                                    <td>${ele.grade}</td>
                                </tr>
                            `
                        });
                        document.getElementById("sgpa").innerHTML = `<b>SGPA:  ${currSgpa}</b>`;
                        hideLoader();
                        showResult();
                    })
            } else if (data.status === "error") {
                switch (data.message) {
                    case "The username is incorrect.":
                        document.getElementById('input-username').style.border = "2px solid red";
                        break;
                    case "The password is incorrect.":
                        document.getElementById('input-password').style.border = "2px solid red";
                        break;
                    case "Invalid sem":
                        document.getElementById('select-sem').style.border = "2px solid red";
                        break;
                    default:
                        document.getElementById('form-info').innerHTML = "<b>Some error occured</b>";
                }
            }
        })
        .catch(err => {
            hideLoader();
            document.getElementById('form-info').innerHTML = "<b>Some error occured</b>";
        });
}

document.getElementById("login-form").addEventListener("submit", login);

document.getElementById('input-username').addEventListener("change", () => {
    document.getElementById('input-username').style.border = "none";
    document.getElementById('form-info').innerHTML = "";
});

document.getElementById('input-password').addEventListener("change", () => {
    document.getElementById('input-password').style.border = "none";
    document.getElementById('form-info').innerHTML = "";
});

document.getElementById('select-sem').addEventListener("change", () => {
    document.getElementById('select-sem').style.border = "none";
    document.getElementById('form-info').innerHTML = "";
});

document.getElementById('select-sem-result').addEventListener("change", (event) => {
    sem = event.target.value;
    showLoaderResult();
    fetch('https://us-central1-iterapi.cloudfunctions.net/getDetailedResult?uname=' + username + '&pass=' + password + '&sem=' + sem)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {

                fetch('https://us-central1-iterapi.cloudfunctions.net/getResult?uname=' + username + '&pass=' + password)
                    .then(res => res.json())
                    .then(data2 => {
                        let currSgpa = 0;
                        data2.data.data.forEach(ele => {
                            if (ele.stynumber === parseInt(sem)) {
                                currSgpa = ele.sgpaR;
                            }
                        });
                        localStorage.setItem('uname', username);
                        localStorage.setItem('pass', password);
                        document.getElementById('select-sem-result').value = sem;
                        document.getElementById('result-body').innerHTML = "";
                        data.data.Semdata.forEach(ele => {
                            document.getElementById('result-body').innerHTML += `
                                <tr>
                                    <td>${ele.subjectcode}</td>
                                    <td>${ele.subjectdesc}</td>
                                    <td>${ele.earnedcredit}</td>
                                    <td>${ele.grade}</td>
                                </tr>
                            `
                        });
                        document.getElementById("sgpa").innerHTML = `<b>SGPA:  ${currSgpa}</b>`;
                        hideLoaderResult();
                        showResult();
                    })
            } else if(data.status === "error" && data.message === "Invalid sem") {
                document.getElementById("sgpa").innerHTML = `<b>INVALID SEM</b>`;
            }
        });
});