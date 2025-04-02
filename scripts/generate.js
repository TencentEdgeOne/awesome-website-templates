// 根据 templates.json 生成 README 和 README.zh 文档

const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'templates.json'), 'utf-8')).EN
const classData = []
const commandsMap = new Map([
  ['installCommand', 'install-command'],
  ['buildCommand', 'build-command'],
  ['outputDirectory', 'output-directory'],
  ['rootDirectory', 'root-directory'],
])

let html = `<div align="center">
  <strong><a href="https://github.com/TencentEdgeOne/awesome-website-templates/blob/main/README.zh.md"> 中文简体 </a> ｜ English</strong>
</div>
<hr/>
<h1 align="center">📢 Awesome Website Templates Collection 📢</h1>
<p align="center"><i>✨ Various selected projects, supporting one-click deployment with EdgeOne Pages, continuously updating... ✨</i></p>
<p align="center"><i>✨ Welcome developers to recommend projects in Discussions! ✨</i></p>\n`


function generateId(name) {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^\w\s]/g, '');
}

function generateClass() {
  let classHtml = `
  <div align="center">
    <table>
      <tr bgcolor="#f0f0f0">`
  const classSet = new Set()
  data.forEach( item => {
    if(item.class) {
      console.log(item.class)
      classSet.add(item.class)
    }
  })
  classSet.forEach(item => {
    const id = generateId(item);
    classData.push(item)
    classHtml += `<th><a href="#${id}">${item}</a></th>\n`
  })
  classHtml += `    </tr>
</table>
</div>`
  html += classHtml
  console.log(html)
}

function generateHref(repoDir, commands) {
  let commandStr = ''
  Object.keys(commands).forEach(item => {
    if(commands[item] === '') return
    commandStr += `&${commandsMap.get(item)}=${commands[item]}`
  })
  let href = encodeURI(`https://edgeone.ai/pages/new?from=awesome&template=${repoDir}${commandStr}`)

  return href
}

function generateProject(projectData) {
  let projectHtml = `  \n<table>
    <td width=350>      
    <img width="300" alt="" src="${projectData.thumbnail}" style="margin-right: 24px"/></td>
    <td width=700><div>
      <strong><a href="${projectData.repoDir}">${projectData.name}</a></strong><div> <br/>
    </div>
      <div><em>${projectData.description}</em><div> <br/>
      <div>
        <a href="${generateHref(projectData.repoDir, projectData.commands)}" target="_blank">One-click deployment</a>
      <div> <br/></td>
  </tr>
</table>`
  console.log(projectHtml)
  return projectHtml
}

function generateClassItem() {
  classData.forEach(item => {
    html += `<h1 id='${generateId(item)}'>${item}</h1>`
    data.forEach(project => {
      if(project.class === item) {
        html += generateProject(project)
      }
    })
  })
  html += `</div>`
}

function writeReadme() {
  fs.writeFileSync(path.resolve(__dirname, '../README.md'), html)
}

generateClass()
generateClassItem()

writeReadme()