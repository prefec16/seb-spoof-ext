const CONFIG_KEY_HEADER = "X-SafeExamBrowser-ConfigKeyHash";
const REQUEST_HASH_HEADER = "X-SafeExamBrowser-RequestHash";
const COMPANION_LOCATION = "http://localhost:9999";

browser.runtime.onMessage.addListener(async (msg) => {
    if (msg.requestUrl !== undefined) {
        let configRequest = await fetch(msg.requestUrl, {
            credentials: "include"
        });

        if (configRequest.status === 200) {
            let config = await configRequest.text();
            let keyRequest = await fetch(COMPANION_LOCATION + "/keys", {
                method: "POST",
                body: JSON.stringify({
                    config: config
                })
            });

            console.log(keyRequest);

            if (keyRequest.status === 200) {
                let keys = await keyRequest.json();
                console.log(keys);
                browser.webRequest.onBeforeSendHeaders.addListener((event) => {
                    let url = event.url;
                    console.log("requesting " + url);

                    return new Promise(((resolve, reject) => {
                        fetch(COMPANION_LOCATION + "/urlhashes", {
                            method: "POST",
                            body: JSON.stringify({
                                url: url,
                                ...keys
                            })
                        }).then(response => {
                            if (response.status === 200) {
                                response.json().then(json => {
                                    new Map([
                                        [REQUEST_HASH_HEADER, json["requestHash"]],
                                        [CONFIG_KEY_HEADER, json["configKeyHash"]],
                                        ["Sec-Fetch-Site", "none"],
                                        ["Sec-Fetch-Mode", "navigate"],
                                        ["Sec-Fetch-User", "?1"],
                                        ["Sec-Fetch-Dest", "document"]
                                    ]).forEach((value, key) => {
                                        event.requestHeaders.push({name: key, value: value});
                                    });

                                    resolve();
                                });
                            }
                        })
                    })).then(value => {
                        return {requestHeaders: event.requestHeaders};
                    });
                }, {urls: [msg.website + "/*"]}, ["requestHeaders", "blocking"]);
            }
        }
    }
});
