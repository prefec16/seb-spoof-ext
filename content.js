const SEB_PREFIX = "seb://";
const SEBS_PREFIX = "sebs://";
const PROTOCOL = location.protocol + "//";
const CMID = "cmid";
const QUIZ_ATTEMPT_DIV = "box py-3 quizattempt";

(async function () {
    let quizAttemptDiv = document.getElementsByClassName(QUIZ_ATTEMPT_DIV).item(0);

    let allForms = document.getElementsByTagName("form");
    for (let form of allForms) {
        if (form.action.startsWith(SEB_PREFIX)) {
            let input = form.children[0];
            if (input.name === CMID) {
                let id = input.value;
                let requestUrl = replacePrefix(form.action) + "?" + CMID + "=" + id;

                let launchBtn = document.createElement("button");
                launchBtn.classList.add("btn", "btn-secondary");
                launchBtn.style.display = "inline-block";
                launchBtn.innerText = "Launch with seb-spoof-extension";
                launchBtn.onclick = (evt) => {
                    browser.runtime.sendMessage({
                        requestUrl: requestUrl,
                        website: location.protocol + "//" + location.host
                    }).then((msg) => {
                        location.reload();
                    }, (error) => {
                        console.error(error);
                    });
                };

                quizAttemptDiv.prepend(launchBtn);
            }
        }
    }
})();

function replacePrefix(str){
    if(str.contains(SEB_PREFIX)){
        return str.replace(SEB_PREFIX, PROTOCOL);
    } else if(str.contains(SEBS_PREFIX)){
        return str.replace(SEBS_PREFIX, PROTOCOL);
    }
}



