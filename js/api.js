// set api hostname
const apiHostname = `https://api.${window.location.hostname}`

// set api endpoints
const countUri = `${apiHostname}/getCount`
const genProblemUri = `${apiHostname}/genProblem`
const evalProblemBaseUri = `${apiHostname}/evalProblem`

userCount();

// get user count from endpoint and write to page
function userCount() {
    fetch(countUri)
        .then(response => response.json())
        .then(response => {
        document.getElementById('user_count').innerHTML = response.user_visits;
        document.getElementById('total_count').innerHTML = response.total_visitors;

        // dynamic plural
        if(parseInt(response.user_visits) != 1) {
            document.getElementById('time_plural').innerHTML = "s"
        }

        // dynamic plural
        if(parseInt(response.total_visitors) != 1) {
            document.getElementById('visitor_plural').innerHTML = "s"
        }
    });
}

// initialize reqId outside function
var reqId;

// get challenge and reqId from api endpoint
function getContact() {
    fetch(genProblemUri)
        .then(response => response.json())
        .then(response => {
        document.getElementById('challenge').src = "data:image/png;charset=utf-8;base64, " + response.problem;
        reqId = response.reqId;
    });
}

//initialize email and phone vars outside function
var email;
var phone;

// submit reqId and user input solution to evalProblemUri
// get response and submit to handler
function evalProblem() {
    var solution = document.getElementById('solution').value;
    var evalProblemUri = evalProblemBaseUri + "?reqId=" + reqId + "&solution=" + solution;
    fetch(evalProblemUri)
        .then(response => response.json())
        .then(response => {
        handleSolution(response.email, response.phone);
    });
}

// removes all children
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// checks if contact info returned is real
// returns new challenge from api if default value is returned
function handleSolution(email, phone) {
    if(email == "try") {
        removeAllChildNodes(document.querySelector('#form_start'));
        
        genForm();

        var again = document.createElement("p");

        again.append("Incorrect answer, please try again.");
        again.id = "try_again";
        document.getElementById("form_start").appendChild(again);
    } else { // if realy contact info is returned, writes to page and makes contact buttons work
        document.getElementById('phone').innerHTML = phone;
        document.getElementById('email').innerHTML = email;

        var tel = phone.replace(/\D/g, "");

        var phone_link = "location.href='tel:" + tel + "';";
        var email_link = "location.href='mailto:" + email + "';";
        document.getElementById('phone_button').setAttribute("onclick", phone_link);
        document.getElementById('email_button').setAttribute("onclick", email_link);

        var del_div = document.getElementById("form_start");
        del_div.parentNode.removeChild(del_div);
    }
}

// generates an html form to display challenge and allow user response
function genForm() {

    var prompt = document.createElement("p");
    prompt.append("Please answer the problem below to reveal my contact information.");
    prompt.id = "prompt";

    var image = document.createElement("img");
    image.src = "data:image/png;charset=utf-8;base64, iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAGbElEQVR4nO3cXUhTfRzA8d+Zzm3nTMxlK0VaYfkyHAnZi9FmtiIXEaSgZWQqMRK6mVJ20XrHIu3lMiSIriwKg4SgF9Kk1qhplN0cW3mRlS8Zko6py53n4jycZ8xc/uZ6NPl9rvY/+++///lyPNtuZARBADI9stnewN+EYiFQLASKhUCxECgWAsVCoFgIFAuBYiFQLASKhUCxECgWAsVCoFgIFAuBYiFQLASKhUCxECgWAsVCoFgIFAuBYiFQLASKhUCxECgWAsVCoFgIFAuBYiFQLASKhUCxECgWAsVCoFgIFAthrsfyer2zvYX/zLlYSqUyPT1dfFxfX8+y7K1bt2Z3S5IpY928eZNhmKNHj/6fuwnCcRzLsiqVahb3EGjOXVmBKisrPR7Pzp07Z3sj/5rTseaaGcWamJi4fPmywWBgWVar1e7du9ftdgdOcLvdFRUVycnJSqUyNTX1yJEjP378CJzQ19dXWlqq0Wg4jsvLy3M6nYHPnj9/nmGYO3fuiMOysjKGYdxud3V1dVJSklqtXrdu3ZMnTwJf0tvbu2/fPo1Gw7Jsbm7u8+fPV61atWLFipmcpiQ67FcKgrBr167m5uacnJyqqqqenp7Gxsb79++3tLRkZWUBwNu3b41GoyAIJSUlycnJLperrq6uo6Pj0aNHDMMAwMjISG5uLs/zGzduzM7O5nnebDb7fL7Q77tjxw6/319QUNDf39/U1GSxWLq6unQ6HQAMDw+bTKb3799v2LBh7dq1PM9v3bpVJpMtWbIk7NMMPudfamxsBICampqpJly9ehUAysvLpSOtra0MwxgMBr/fLwhCdXW1Tqdra2uTJpSXlwPAixcvxOGJEycA4NChQ9KE69evA0BaWpo4PHfuHADcvn1bHO7fvx8Atm/fPj4+Lh65ePEiAJw+fVocHj9+HAAqKyuDFkxJSZnqLFDCj5WVlRUTE/P58+fAg4WFhQDw7NmzX76koaEBABoaGsRhWlqaXC7v7e0NnKNQKELHam9vlyZ3dnYCQFlZmTjMyMiIjo7+8uVL4IIcx0UqVpj3LJ/P9+bNm5UrVyYlJQUez8vLAwCXyyUOP378ePDgQb1ez3EcwzBWqxUAxsbGAGB8fLyrq2v58uWLFy9GvXVMTIz0WK1WA8Dw8DAATExM8Dy/dOnSxMTE8E7qt8K8Zw0ODgqCMHlb4pkPDQ0BgNPp3Lx5c2xs7IEDBzIzM+Pj4x88eHDlyhVxpsfjEQQBWyoEr9fr9/sjuOBkYcaKi4sDgIGBgaDjX79+BQCNRgMAx44d83q9LpdLr9eLz/b09Egz1Wo1wzCDg4PhbWAylmWjo6MjuOBkYf4ZqlQqvV7P83xQr7a2NgBYvXo1ALx79y4hIUEqBQCjo6PSY7lcnp6e/uHDh0idnkwm0+v13d3d/f39EVnwF28R9iutVuvo6KjdbpeOvHz5sqmpKTMzMycnBwCWLVv27du39vZ28Vm3233hwgUA8Pv94pE9e/aMjY2dPXtWWuHatWviHS08xcXFPp/vzJkzgQt6PJ7AOZ8+fRIC/jtD6GGwqe784qfh+vXraybheV4QhJ8/f27btg0AjEbjyZMnrVarSqWKj4/v6OgQVxB/AHMcV1JSUlBQoFAoFixYAACnTp0SJ4yMjGRkZACAyWSy2WwWi0WpVP7207Czs1PaZHd3NwAUFhYGLWg0Gm02W35+vkKhkMlk0qdhXV0dANjt9ukMJ/vNPcvpdAZ9qwaATZs2paamRkVF3bt379KlSzdu3KitrV24cGFRUZHdbk9JSRGnFRUVyWSy2trau3fvJiQkVFVVmc3mLVu2vH79WpzAcVxra+vhw4ebm5tfvXq1Zs2ax48fV1RUhN5SCIELulyu7Ozshw8f5ufnR0VFiRMWLVqkUqm0Wu10hpMxoa66v9/AwIBWqzWZTE+fPp35avPqh3RfX9/u3bu/f/8uHamvrwcAi8USkfXn1ZXlcDjMZnNsbGxxcXFcXJzD4WhpaTEYDA6HQ/z6OlPT/Kb/t+B5vrS0NDExUS6X63Q6m802NDQUqcXn1ZX1p82re9afRrEQKBYCxUKgWAgUC4FiIVAsBIqFQLEQKBYCxUKgWAgUC4FiIVAsBIqFQLEQKBYCxUKgWAgUC4FiIVAsBIqFQLEQKBYCxUKgWAgUC4FiIVAsBIqFQLEQKBYCxUKgWAj/ADpFKHF3DArNAAAAAElFTkSuQmCC";
    image.id= "challenge"

    var form = document.createElement("form");

    form.setAttribute("name", "captcha_form")
    form.setAttribute("action", "javascript:void(0);");

    var answer = document.createElement("input");
    answer.setAttribute("type", "number");
    answer.setAttribute("id", "solution");
    answer.setAttribute("placeholder", "Solution");

    var s = document.createElement("button");
    s.innerHTML = "Submit";
    s.setAttribute("id", "submit");
    s.setAttribute("onclick", "return evalProblem()");

    form.append(answer);
    
    form.append(s);

    document.getElementById("form_start").appendChild(document.createElement("br"));
    document.getElementById("form_start").appendChild(prompt);
    document.getElementById("form_start").appendChild(document.createElement("br"));
    document.getElementById("form_start").appendChild(image);
    document.getElementById("form_start").appendChild(document.createElement("br"));
    document.getElementById("form_start").appendChild(form);

    getContact();

    document.getElementById('phone_button').setAttribute("onclick", "javascript:void(0);");
    document.getElementById('email_button').setAttribute("onclick", "javascript:void(0);");
}