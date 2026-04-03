import * as fs2 from 'fs'

function main(){
    fs2.readFile('./test.txt', (err, data)=>{
        console.log('read finished')
    })
    console.log("Hello via Bun!");
}