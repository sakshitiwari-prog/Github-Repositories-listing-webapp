const http = require('http');

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/PublicGithubRepo') {
        let resData = '';
        req.on('data', chunk => {
            resData += chunk;
        }); 
        req.on('end', () => {
            const requestData = JSON.parse(resData);
            const { Username } = requestData;
            // console.log('Received data:', Username);
            if (Username) {
                getUserGitRepo(Username).then(data => {
                    if (data && data.length > 0) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Data', requestData: data }));

                    } else {
                        res.end(JSON.stringify({ message: 'Data not found or API limit exceeded' }));

                    }
                });
            } else {
                res.end(JSON.stringify({ message: 'Username is not specified' }));

            }

        });
    } else if (req.method === 'POST' && req.url === '/PublicGithubRepo/filteredRepo') {
        let resData = '';
        req.on('data', chunk => {
            resData += chunk;
        })
        req.on('end', () => {
            const requestData = JSON.parse(resData);
            const { start, end, username } = requestData;
            console.log(start, end, username);
            if (start>=0 && end && username) {
                getUserGitRepo(username).then(data => {
                    if (data && data.length > 0) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Data', requestData: data.reposData.filter((_, index) => index >= start && index < end) }));

                    } else {
                        res.end(JSON.stringify({ message: 'Data not found' }));

                    }
                });
            } else {
                res.end(JSON.stringify({ message: 'specify start,end,username properly' }));
            }
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }

})
async function getUserGitRepo(Username) {
    try {
        let data = await fetch(`https://api.github.com/users/${Username}`);
        let jsonData = await data.json();
        const { name, bio, location, twitter_username, url, avatar_url, repos_url, login } = jsonData;

        let reposData = await fetch(`${repos_url}`);
        let repoJsonData = await reposData.json();
        return {
            login, name, bio, location, twitter_username, url, avatar_url, reposData: repoJsonData
        }
    } catch (e) {
        return e
    }
}
server.listen(8000, (err) => {
    console.log('server is running at 8000');
    if (err) {
        console.log(err);
    }
})


