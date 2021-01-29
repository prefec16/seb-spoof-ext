const SEB_PREFIX = "seb://";
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
                let requestUrl = form.action.replace(SEB_PREFIX, PROTOCOL) + "?" + CMID + "=" + id;

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




