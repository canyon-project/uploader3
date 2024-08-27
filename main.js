import fs from 'fs';
import istanbulLibCoverage from "istanbul-lib-coverage";
import axios from "axios";
const initialCoverage = istanbulLibCoverage.createCoverageMap({})


const files = fs.readdirSync('./.canyon_output/')

files.forEach(file => {
    if (file.includes('coverage-')) {
        initialCoverage.merge(JSON.parse(fs.readFileSync(`./.canyon_output/${file}`, 'utf-8')))
    }
})

fs.writeFileSync('./.canyon_output/coverage-final.json', JSON.stringify(initialCoverage.toJSON(), null, 2), 'utf-8')


const canyon = JSON.parse(fs.readFileSync('./.canyon_output/canyon.json', 'utf-8'))



function newAtob() {
  try {
    return typeof atob === 'function' ? atob : null
  } catch (e) {
    return null
  }
}
const newatob = newAtob()

const proxy = (process.env.CI_SERVER_URL || '').includes(newatob('Y3RyaXA=')) ? {
  proxy: {
    protocol: 'http',
    host: newatob('cHJveHlnYXRlMi5jdHJpcGNvcnAuY29t'),
    port: 8080
  }
} : {}
try {
  axios.post(canyon.dsn.replace('https://','http://'), {
    coverage: initialCoverage.toJSON(),
    ...canyon
  }, {
    headers: {
      Authorization: 'Bearer ' + canyon.reporter,
    },
    timeout: 15000,
    ...proxy
  }).catch(err=>{
    console.log('Failed to post coverage data:', err)
  })
} catch (e) {
  console.log('Failed to post coverage data:', e)
}
