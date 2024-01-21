let submit = document.getElementById('Submit');
let UsernameForm = document.getElementById('UsernameForm');
let loaderOverlay = document.getElementsByClassName('loader-overlay')
function showLoader() {
    loaderOverlay[0].computedStyleMap.display = 'block';
}
function hideLoader() {
    loaderOverlay[0].computedStyleMap.display = 'none';
}
submit.addEventListener('click', async (e) => {
    e.preventDefault();

    let formData = new FormData(UsernameForm);
    let UsernameVal = formData.get('Username');
    const PublicGithubRepoApiEndpoint = 'http://127.0.0.1:8000/PublicGithubRepo';
    const dataToSend = {
        Username: UsernameVal
    };
    try {
        if (UsernameVal) {
            showLoader();
            let data = await fetch(PublicGithubRepoApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            let resJsonData = await data.json();
            if (resJsonData.requestData && resJsonData.requestData.length > 0) {
                localStorage.setItem('userData', JSON.stringify(resJsonData));

                window.location.href = '/PublicGithubRepositryClient/UserRepo.html'
                hideLoader();
            } else {
                hideLoader();
                alert(resJsonData.message)
            }
        } else {
            alert('Please specify a username')
        }
    } catch (e) {
        console.error('Error making request:', e)
    }


})    