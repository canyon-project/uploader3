import fs from 'fs';
import istanbulLibCoverage from "istanbul-lib-coverage";

const initialCoverage = istanbulLibCoverage.createCoverageMap({})


const files = fs.readdirSync('./.canyon_output/')

files.forEach(file => {
    if (file.includes('coverage-')) {
        initialCoverage.merge(JSON.parse(fs.readFileSync(`./.canyon_output/${file}`, 'utf-8')))
    }
})

fs.writeFileSync('./.canyon_output/coverage-final.json', JSON.stringify(initialCoverage.toJSON(), null, 2), 'utf-8')


const canyon = JSON.parse(fs.readFileSync('./.canyon_output/canyon.json', 'utf-8'))


console.log(canyon)

fetch(canyon.dsn,{
    method:'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${canyon.reporter}`
    },
    body: JSON.stringify({
        coverage: initialCoverage.toJSON(),
        ...canyon
    })
}).then(r=>r.json()).then(r=>{
    console.log(r)
})
