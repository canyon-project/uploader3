import fs from 'fs';
import axios from "axios";
import {checkCanyonFormat, mergeCoverageMap} from "./helper.js";

let initialCoverage = {}

export const uploadCanyonCoverage = async ()=>{
  // 1.检查是否存在.canyon_output文件夹
  if (!fs.existsSync('./.canyon_output')) {
    console.log('.canyon_output文件夹不存在')
      return false
  }

  // 2.检查是否存在canyon.json文件
  if (!fs.existsSync('./.canyon_output/canyon.json')) {
    console.log('canyon.json文件不存在')
      return false
  }
  const canyon = JSON.parse(fs.readFileSync('./.canyon_output/canyon.json', 'utf-8'))

  // 3.检查canyon文件格式

  if (!checkCanyonFormat(canyon)) {
    console.log('canyon文件格式错误')
      return false
  }

  const files = fs.readdirSync('./.canyon_output/')

  let arr = []

  files.forEach(file => {
      if (file.includes('coverage-')) {
        arr.push(file);
        initialCoverage = mergeCoverageMap(initialCoverage, JSON.parse(fs.readFileSync(`./.canyon_output/${file}`, 'utf-8')));
      }
  })

  console.log(`共发现${arr.length}个覆盖率文件`)


  try {
    fs.writeFileSync('./.canyon_output/coverage-final.json', JSON.stringify(initialCoverage, null, 2), 'utf-8')
    return await axios.post(canyon.dsn.replace('https://','http://'), {
      coverage: initialCoverage,
      ...canyon,
      reportID:'debug',
    }, {
      headers: {
        Authorization: 'Bearer ' + canyon.reporter,
      },
      timeout: 15000,
    }).then(res=>{
      console.log(res.data)
      return true
    }).catch(err=>{
      console.log('Failed to post coverage data:', err)
      return false
    })
  } catch (e) {
    console.log('Failed to post coverage data:', e)
    return false
  }
}
