import express from 'express';
const app = express();

app.use(express.json());

const history = [];

app.get('/history', (req, res) => {
    let historyHTML='<table border="1">';
    historyHTML+='<tr><th>ID</th><th>Request URL</th></tr>';
    history.forEach((element,index)=>{
        historyHTML+=`<tr><td>${index+1}</td><td>${element.reqUrl}</td></tr>`;
    })
    historyHTML+='</table>';
    res.send(`
    <!DOCTYPE html>
        <html>
        <head>
            <title>History</title>
        </head>
        <body>
            <h1>History of past 20 operations</h1>
            ${historyHTML}
        </body>
        </html>
    `);
});

app.get('/', (req, res) => {
    
    res.send(`
    <!DOCTYPE html>
        <html>
        <head>
            <title>Home</title>
        </head>
        <body>
            <h1>Example of Demo</h1>
            <ul>
                <li>
                    <a href="http://localhost:8000/1/plus/2">http://localhost:8000/1/plus/2</a>
                </li>
                <li>
                    <a href="http://localhost:8000/1/minus/3/into/4/by/5">http://localhost:8000/1/minus/3/into/4/by/5</a>
                </li>
                <li>
                    <a href="http://localhost:8000/5/into/4">http://localhost:8000/5/into/4</a>
                </li>
                <li>
                    <a href="http://localhost:8000/8/into/10">http://localhost:8000/8/into/10</a>
                </li>
                <li>
                    <a href="http://localhost:8000/10/into/5/plus/2">http://localhost:8000/10/into/5/plus/2</a>
                </li>
            </ul>

        </body>
        </html>
    `);
});

app.get('/*', (req, res) => {
    const inputString = req.params[0];
    const inputArray = inputString.split("/");
    let result = parseFloat(inputArray[0]);
    let question = `${result}`;
    for (let i = 1; i < inputArray.length; i += 2) {
        const operation = inputArray[i];
        const num = parseFloat(inputArray[i + 1]);
        
        switch (operation) {
            case "plus":
                result += num;
                question =question+`+${num}`;   
                break;
            case "minus":
                result -= num;
                question =question+`-${num}`;
                break;
            case "into":
                result *= num;
                question =question+`*${num}`;
                break;
            case "by":
                if (num === 0) {
                    res.send("Cannot divide by zero");
                    return;
                } else {
                    result /= num;
                    question =question+`/${num}`;
                    break;
                }
            default:
                res.send("Invalid operation");
                return;
        }
    }
    const reqUrl=`http://localhost:${PORT}`+req.originalUrl;
    if(!isNaN(result)){
        history.push({reqUrl});
    }
    
    if (history.length > 20) {
        history.shift(); 
    }
    res.json({"question":question,answer:result.toString()});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
