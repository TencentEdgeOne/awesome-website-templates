// 根据 templates.json 生成 README 和 README.zh 文档

const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'templates.json'), 'utf-8')).CH
const classData = []
const commandsMap = new Map([
  ['installCommand', 'install-command'],
  ['buildCommand', 'build-command'],
  ['outputDirectory', 'output-directory'],
  ['rootDirectory', 'root-directory'],
  ['projectName', 'project-name'],
  ['repositoryName', 'repository-name'],
])

let html = `<div align="center">
  <strong><a href="https://github.com/TencentEdgeOne/awesome-website-templates/blob/main/README.zh.md"> 中文简体 </a> ｜ English</strong>
</div>
<hr/>
<h1 align="center">📢 很棒的网站模板集合 📢</h1>
<p align="center"><i>✨ 各类精选项目，支持EdgeOne Pages一键部署，持续更新... ✨</i></p>
<p align="center"><i>✨ 欢迎开发者在讨论区推荐项目！ ✨</i></p>\n`


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
    commandStr += `&${commandsMap.get(item)}=${encodeURIComponent(commands[item])}`
  })
  let href = `https://edgeone.ai/pages/new?from=awesome&template=${repoDir}${(commandStr)}`
  return href
}

function generateProject(projectData) {
  let projectHtml = `  \n<table>
    <td width=350>      
    <img width="300" object-fit="fill" alt="${projectData.name}" src="${projectData.thumbnail}" style="margin-right: 24px"/></td>
    <td width=700><div>
      <h3>${projectData.name} · <a href="${projectData.repoDir}">Github👆</a></h3><div> <br/>
    </div>
      <div><em>${projectData.description}</em><div> <br/>
      <div>
        <a href="${generateHref(projectData.repoDir, projectData.commands)}" target="_blank" style="text-decoration: none;">🚀 一键部署</a>
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
  fs.writeFileSync(path.resolve(__dirname, '../README.zh.md'), html)
}

generateClass()
generateClassItem()

writeReadme()