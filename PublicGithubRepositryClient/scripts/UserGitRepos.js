let UserData = localStorage.getItem('userData');
let { requestData } = JSON.parse(UserData);
let loaderOverlay = document.getElementsByClassName('loader-overlay')
function showLoader() {
    loaderOverlay[0].computedStyleMap.display = 'block';
}
function hideLoader() {
    loaderOverlay[0].computedStyleMap.display = 'none';
}
let prev = document.getElementsByClassName('prev');
let next = document.getElementsByClassName('next');
let repoNumbers = document.getElementsByClassName('repo-numbers');
let repoLmt = 10;
let currentPage = 1;
let repoNumCount;
if (requestData.reposData)
    repoNumCount = Math.ceil(requestData.reposData.length / repoLmt);

document.getElementsByClassName('username')[0].innerHTML = `${requestData.name}`;
document.getElementsByClassName('bio')[0].innerHTML = `${requestData.bio}`;
document.getElementsByClassName('location')[0].innerHTML = `${requestData.location}`;
document.getElementsByClassName('twitter')[0].innerHTML = `Twitter: ${requestData.twitter_username} `;
document.getElementsByClassName('git-link')[0].innerText = requestData.url;
document.getElementsByClassName('user-img')[0].src = requestData.avatar_url;
function getRepoNumbers() {
    if (repoNumCount)
        for (let i = 1; i <= repoNumCount; i++) {

            let repoNum = document.createElement("a");
            let repoNumContainer = document.createElement("div");
            repoNumContainer.innerText = i;
            repoNumContainer.classList.add('repo-num-container');
            repoNum.appendChild(repoNumContainer);
            repoNum.href = '#';
            repoNum.style.textDecoration = 'none';
            repoNum.setAttribute('index', i);
            repoNumbers[0].appendChild(repoNum);
        }
}
function disabled(button) {
    button[0].classList.add('disabled');
    button[0].setAttribute('disabled', true);
}
function enabled(button) {
    button[0].classList.remove('disabled');
    button[0].removeAttribute('disabled');
}
function prevNextController() {
    if (currentPage == repoNumCount) {
        disabled(next);
    } else {
        enabled(next);
    }
    if (currentPage == 1) {
        disabled(prev);
    } else {
        enabled(prev);
    }
}
function repoCurrentButtonHandler() {
    document.querySelectorAll('a').forEach((repo) => {
        repo.children[0].classList.remove('active');
        let pageIndex = Number(repo.getAttribute('index'));
        if (currentPage == pageIndex) {
            repo.children[0].classList.add('active');
        }
    })

}
async function setCurrentRepoPage(pageNum) {
    currentPage = pageNum;
    let end = currentPage * repoLmt;
    let start = (currentPage - 1) * repoLmt;
    repoCurrentButtonHandler();
    prevNextController();
    const PublicGithubCurrentRepoListEndpoint = 'http://127.0.0.1:8000/PublicGithubRepo/filteredRepo';
    const dataToSend = {
        start, end, username: requestData.login
    };
    try {
        showLoader();
        let getCurrentRepoList = await fetch(PublicGithubCurrentRepoListEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        let jsonCurrentRepoList = await getCurrentRepoList.json();
        while (document.getElementsByClassName('bottom-part')[0].firstChild) {

            document.getElementsByClassName('bottom-part')[0].removeChild(document.getElementsByClassName('repo-list')[0].firstChild);
        }
        if (jsonCurrentRepoList.requestData && jsonCurrentRepoList.requestData.length > 0) {
            document.getElementsByClassName('bottom-part')[0].classList.remove('error-container')
            // myElement.classList.remove("highlight");
            jsonCurrentRepoList.requestData.forEach((repo) => {


                let outerModal = document.createElement("div");
                outerModal.classList.add('modal-dialog');

                let innerModal = document.createElement("div");
                innerModal.classList.add('modal-content');
                outerModal.appendChild(innerModal);

                let repoHeading = document.createElement("p");
                repoHeading.classList.add('repo-heading');
                innerModal.appendChild(repoHeading);
                repoHeading.innerText = repo.name;

                let repoBio = document.createElement("p");
                repoBio.classList.add('repo-bio');
                innerModal.appendChild(repoBio);
                repoBio.innerHTML = `${repo.description}`;

                if (repo.language) {
                    let repoLangContainer = document.createElement("div");
                    repoLangContainer.classList.add('repo-lang-container');
                    innerModal.appendChild(repoLangContainer);
                    let repoLang = document.createElement("p");
                    repoLang.classList.add('repo-lang');
                    repoLangContainer.appendChild(repoLang);
                    repoLang.innerText = repo.language;
                }

                // document.getElementsByClassName('repo-list')[0].innerHTML="";
                document.getElementsByClassName('bottom-part')[0].appendChild(outerModal);
            });
        } else {
            while (document.getElementsByClassName('footer')[0].firstChild) {

                document.getElementsByClassName('footer')[0].removeChild(document.getElementsByClassName('footer')[0].firstChild);
            }
            let errorMsg = document.createElement('p');
            errorMsg.innerText = jsonCurrentRepoList.message;
            errorMsg.classList.add('errorMsg');
            document.getElementsByClassName('bottom-part')[0].classList.remove('repo-list')
            document.getElementsByClassName('bottom-part')[0].classList.add('error-container');
            document.getElementsByClassName('bottom-part')[0].appendChild(errorMsg);

        }

        hideLoader();
    } catch (e) {
        console.error('Error making request:', e)
    }
}
window.addEventListener('load', () => {
    getRepoNumbers();
    setCurrentRepoPage(currentPage);
    repoCurrentButtonHandler();
    document.querySelectorAll('a').forEach(repo => {
        let pageIndex = repo.getAttribute('index');
        if (pageIndex) {
            repo.addEventListener('click', () => {
                setCurrentRepoPage(pageIndex);
            })
        }
    });
    prev[0].addEventListener('click', () => {
        if (currentPage > 1) {
            setCurrentRepoPage(currentPage - 1);
        }
    });
    next[0].addEventListener('click', () => {
        if (currentPage < repoNumCount) {
            setCurrentRepoPage(currentPage + 1);
        }
    });

})

