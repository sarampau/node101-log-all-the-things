const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here
    let agent = req.headers['user-agent'].replace(',', '');
    let time = new Date().toISOString();
    let method = req.method;
    let resource = req.url;
    let version = 'HTTP/' + req.httpVersion;
    let status = '200';
    let logs = `${agent},${time},${method},${resource},${version},${status}\n`;
    fs.appendFile('./log.csv', logs, (err) => {
        if (err) {
            throw err;
        }
        console.log(logs);
        next();
    })
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile('./log.csv', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let lines = data.split('\n');
        let jsonData = [];
        lines.forEach(line => {
            let content = line.split(',');
            let obj = {
                'Agent': content[0],
                'Time': content[1],
                'Method': content[2],
                'Resource': content[3],
                'Version': content[4],
                'Status': content[5]
            }
            jsonData.push(obj);
        })
        return res.json(jsonData);
    })
});

module.exports = app;
