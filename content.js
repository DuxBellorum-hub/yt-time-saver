chrome.storage.local.get("state")
    .then(s => {
        if (s.state) {
            const contentObserver = new MutationObserver(() => {
                let contents = document.querySelectorAll('#contents');
                if (contents.length) {
                    removeUselessContent(contents);
                    contentObserver.disconnect();
                }
            });
            contentObserver.observe(document, { childList: true, subtree: true });

            document.addEventListener('DOMNodeInserted', function (event) {
                if (event.target.id === "related") {
                    let recommendedVideos = document.querySelectorAll('#related');
                    recommendedVideos.forEach(e => e.style.display = "none");
                }
            });

        }
    }).catch(e => console.error(e));

document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById("_checkbox");
    getCurrentTab().then(tab => {
        let ytNone = document.querySelector('.yt-none');
        if (!tab.url.includes("youtube.com")) {
            ytNone.style.visibility = "visible";
            checkbox.setAttribute("disabled", '');
        } else {
            ytNone.style.visibility = "hidden";
        }
    })
    checkStateAndChangeButtonDisplay(checkbox);
    checkbox.addEventListener("click", checkboxClickHandler);
});

function checkboxClickHandler() {
    updateButtonState();
    chrome.tabs.reload();
    window.close();
}


function removeUselessContent(contents) {
    if (contents.length) {
        contents.forEach(e => e.style.display = "none");
    } else {
        console.error("No content to remove !");
    }
    removeUselessItems();
}

function removeUselessItems() {
    let ytLogo = document.querySelector("#logo-icon");
    let countryCode = document.querySelector("#country-code");
    let sidebar = document.querySelector('ytd-mini-guide-renderer');
    let hiddenSidebar = document.querySelector('#guide-inner-content');
    let sideBarButton = document.querySelector("#guide-button");
    let hiddenYtLogo = document.querySelector('#guide-content > #header');
    if (hiddenYtLogo !== null && hiddenYtLogo !== undefined) hiddenYtLogo.style.visibility = "hidden";
    if (sidebar != null && sidebar !== undefined) sidebar.style.visibility = "hidden";
    if (hiddenSidebar != null && hiddenSidebar !== undefined) hiddenSidebar.style.visibility = "hidden";
    if (sideBarButton != null && sideBarButton !== undefined) sideBarButton.style.visibility = "hidden";
    if (ytLogo != null && ytLogo !== undefined) ytLogo.style.display = "none";
    if (countryCode != null && countryCode !== undefined) countryCode.style.display = "none";

    let tabs = document.querySelector('#chips');
    if (tabs != null && tabs !== undefined) tabs.style.display = "none";

}


async function updateButtonState() {
    await chrome.storage.local.get("state")
        .then(async (s) => {
            if (s.state) await chrome.storage.local.set({ "state": !s.state });
            else await chrome.storage.local.set({ "state": !s.state });
        })
        .catch(e => console.error(e));
}

async function checkStateAndChangeButtonDisplay(checkbox) {
    await chrome.storage.local.get("state")
        .then(s => {
            if (s.state) {
                checkbox.checked = true;
            } else checkbox.checked = false;

        }).catch(e => console.error(e));
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
