export const checkCanyonFormat = (canyon) => {
//   必须含有的字段，projectID,dsn,reporter,sha，instrumentCwd
  if (!canyon.projectID){
    console.log('projectID字段不存在')
    return false
  } else if (!canyon.dsn||!canyon.dsn.includes('http')){
    console.log('dsn字段不存在或格式错误')
    return false
  } else if (!canyon.reporter){
    console.log('reporter字段不存在')
    return false
  } else if (!canyon.sha||canyon.sha.length<16){
    console.log('sha字段不存在或格式错误')
    return false
  } else if (!canyon.instrumentCwd){
    console.log('instrumentCwd字段不存在')
    return false
  }
  return true
}
