console.info("Script loaded");


const defaultJson = `[
{
    "key": "phonenumber",
    "value": "0612345678"
},
{
    "key": "email",
    "value": "tester@test.nl"
},
{
    "key": "iban",
    "value": "NL97RABO8205778493"
},
{
    "key": "name",
    "value": "Tester"
},
{
    "key": "future-date",
    "value": "24-01-2026"
},
{
    "key": "past-date",
    "value": "24-01-1990"
},
{
    "key": "zipcode",
    "value": "1092BV"
},
{
    "key": "number",
    "value": "262"
},
{
    "key": "decimal",
    "value": "12.25"
}
]`;

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const setValidationMessage = (el, msg) => {
    console.info(`el: ${el}`);
    el.querySelector("span").innerText = msg;
    el.style.display = "block";
}

const validateInput = (input) => {
    const validation = document.querySelector(".validation");
    validation.style.display = "none";
    let succes = true;
    if (validation) {
        if (isJson(input)) {
            if (!Array.isArray(JSON.parse(input))) {
                setValidationMessage(validation, "Not an Array")
                succes = false;
            }
        } else {
            setValidationMessage(validation, "Not a valid JSON");
            succes = false;
        }
    } else {
        console.info("no validation found");
    }
    return succes;

}

const onclick = (e) => {
    console.info('Starting onclick...');
    let value = document.querySelector(".json-input").value.trim();
    if (validateInput(value)) {
        //setValidationMessage(value)
        chrome.storage.local.set({classes: value.trim()}, function() {
            console.log('Value is set to ' + value);
            chrome.tabs.reload();
            console.info('Ending onclick...');
        });
    }    
}

chrome.storage.local.get(['rente'], function (result) {
    const json = (result.classes || defaultJson).trim();
    console.info("defaultJson = "+json);
    const input = document.querySelector(".json-input");
    input.value = json;
    const btn = document.getElementById("refresh-btn");
    btn.addEventListener("click", onclick);
});



