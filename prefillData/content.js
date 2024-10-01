console.info("PrefillData script is triggered.");

// define global varaibles which can be accessed while running the script
let triggerEventHandlers = true;
let keyValuePairs = '';

const setClickEventForSelector = (selector) => {
    document.querySelectorAll(selector).forEach(btn => {
        if (btn) {
            console.info('found one nextButton');
            btn.addEventListener('click', function(event) {
                // onclick call this parent function again, to set attributes and buttons on the next page
                setVariables.call(this);
            });
        } else {
            console.info('no button found');
        }
    });
}

const setLeaveEventForElement = (el) => {
    if (el) {
        el.addEventListener('blur', function(event) {
            console.info(`onleave triggered... triggerEventHandlers=${triggerEventHandlers}`);
            if (triggerEventHandlers) {
                console.info(`eventhandler ${event.id} triggered`);
            // onblur (unfocus) call this parent function again, to set attributes and buttons and blurs on the next page
                setVariables.call(this);
            } else {
                console.info("eventhandler skipped");
            }
        });
    } else {
        console.info('no input found');
    }
}

const getClasses = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['classes'], function(result) {
            const classList = result.classes || '[{"error": "fetchingJson failed"}]';
            console.log(`classlist inside getClasses: ${classList}`);
            const classes = JSON.parse(classList.trim());
            if (classes[0].error) {
                console.info('No data yet');
            }
            resolve(classes);
        });
    })

}

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.info(`setting timeout ${time} milisec... time: ${new Date().getTime()}`)
            resolve(true);
        }, time);
    });
}

// get the classesList and their values from localStorage and try to find the mx-page DomObject. Whenever it's found 
// continue with SetVariables()
const run = async () => {
    console.info(`Starting Run()... time: ${new Date().getTime()}`);
    keyValuePairs = await getClasses();
    const mxPageFound = () => {return document.querySelector(".mx-page") != null};

    while (!mxPageFound()) {
        await sleep(1000);
    }
    setVariables();

}

const setVariables = () => {
    console.info(`Starting SetVariables()... ${new Date().getTime()}`);
    //DEBUG console.info(`**** classlist outside getClasses: ${JSON.stringify(keyValuePairs)}`);
    // set triggerEventHandlers to false since we dispatch the och-microflows on the fields, then we dont want to retrigger this funtion again.
    triggerEventHandlers = false;
    console.info(`SetVarablesTriggered... triggerEventHandlers: ${triggerEventHandlers}`);
    setTimeout(() => {
        
        const query ="."+keyValuePairs.map(kvp => kvp.key).join(', .');
        console.info(`query: ${query}`);
        const classHolders = document.querySelectorAll(query);
        console.info(`amount of classHolders: ${classHolders.length}`);

        for (const holder of classHolders) {
            const holderClasses = Array.from(holder.classList);
            let input;
            if (holderClasses.includes('mx-textarea')) {
                input = holder.getElementsByTagName('textarea')[0];
            } else {
                input = holder.getElementsByTagName('input')[0];
            }

            if (input && holderClasses && holderClasses.length > 0) {
                console.info(`input found`);
                const foundClassses = Array.from(holderClasses.map(className => keyValuePairs.find(kvp => kvp.key === className)))
                const kvp = foundClassses.find(cls => cls != null);
                if (kvp) {
                    if (!input.value | input.value == '0,00') {
                        input.value = kvp.value;
                        // create input event and trigger it on the input sothat all handlers are triggerd appropriately and the value..
                        // ..is actually set in the mendix context.
                        const event = new Event('input', {
                            bubbles: true,
                            cancelable:true
                        });
                        // everytime something changed, we need to trigger the events already on the field, sothat the values are actually
                        // set on the MxContext obj and possible ochHandlers are triggered.
                        input.dispatchEvent(event);
                    } 
                }         
            } 
        }
        // each time you change a field, it could be that another field appears on the screen, we have to rerun the script onleave
        // ...of every input.
        const allInputs = document.querySelectorAll('input, select, textarea');
        console.info(`amount of inputs: ${allInputs.length}`);
        for (const i of allInputs) {
                //console.info('setting blur on input with type='+i.getAttribute('type'));
                console.info(`element tagname ${i.tagName}`);
                setLeaveEventForElement(i);
        }
        setClickEventForSelector('.next-button');

        // set trigger eventhandlers to true again, sothat when someone enters a field manually, the setLeaveEvent and SetClickevent are triggered.
        triggerEventHandlers = true;

    }, 3000);
}

run();
