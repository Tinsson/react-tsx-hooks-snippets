const fs = require('fs')
const path = require('path')

// example 目录的绝对路径
const exampleDir = path.resolve(__dirname, 'example')
// 输出json配置目录
const outputDir = path.resolve(__dirname, 'snippets')

// 初始化代码片段json
const snippetsMap = {}

const readDir = (rootDir) => {
  const fileList = fs.readdirSync(rootDir)
  if (fileList.length > 0) {
    fileList.forEach(fileName => {
      const filePath = path.join(rootDir, fileName)
      const statInfo = fs.statSync(filePath)
      // 如果是目录继续遍历
      if (statInfo.isDirectory()) {
        readDir(filePath)
      } else if (statInfo.isFile()) {
        handleFile(filePath, fileName)
      }
    })
  }
}

// 处理文件
const handleFile = (filePath, fileName) => {
  let name = fileName.split('.')[0]
  let prefix = fileName.split('.')[0]
  let des = ''
  const bodyList = []

  const fileInfo = fs.readFileSync(filePath, 'utf8')
  const lineSplits = fileInfo.split('\n')

  // 逐行区分，对名称，描述，prefix做提取处理
  lineSplits.forEach(line => {
    const nameReg = /\/\/\s+@name:\s*(.*)/
    const prefixReg = /\/\/\s+@prefix:\s*(.*)/
    const desReg = /\/\/\s+@description:\s*(.*)/
    if (nameReg.test(line)) {
      name = line.match(nameReg)[1]
    } else if (prefixReg.test(line)) {
      prefix = line.match(prefixReg)[1]
    } else if (desReg.test(line)) {
      des = line.match(desReg)[1]
    } else {
      bodyList.push(line)
    }
  })

  snippetsMap[name] = {
    prefix,
    body: bodyList.length > 1 ? bodyList : bodyList[0],
    description: des
  }
}

readDir(exampleDir)

fs.writeFile(path.join(outputDir, 'snippets.json'), JSON.stringify(snippetsMap, null, 2), (err) => {
  if (err) throw err;
  console.log('write success')
})