const express = require('express')
const fs = require('fs')
const {request, urlencoded, response} = require('express');
const reader = require('xlsx')
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(urlencoded({extended: false}))

app.post('/login', (req, res)=>{
    const token = jwt.sign({ name: 'Artem' }, 'key', { expiresIn: 1500000 });
    console.log(token)
    res.json(JSON.stringify({token: token}))
})
app.post('/verify', (req, res)=>{
    const token = req.body.token;
    console.log(token)
    jwt.verify(token, 'key', (token, err)=>{
        console.log(token + '!!')
    })
})

app.post('/person', (req, res) => {
    //console.log(req.body);
    const file = reader.readFile('./Base.xlsx')
    const  people = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
    console.log(people)
    console.log(req.body)
    let i=1;
    for(let one of people){
        if(i++%2===0){
            one.img=fs.readFileSync('./photoEx.jpg')
        }
    }

    let data=[]
    for(let one of people){
        let find = true
        for(let two in req.body){
            if(req.body[two]!==one[two]+''){
                find=false
            }
        }
        if(find)data.push(one)
    }
    console.log(data)
    res.json(JSON.stringify(data))
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});
