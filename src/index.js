// import 'babel-polyfill'
import React from 'react'
import list from './testList'
import './style/index.scss'
import icon from '../assets/images/webpack.png'

const header = document.createElement('h1')
header.innerHTML = 'Im Working!'

const div = document.createElement('div')
div.classList.add('icon')

document.body.appendChild(header)
document.body.appendChild(div)


const myList = document.createElement('ul')

for(let i = 0; i < list.length; i++){
	let li = document.createElement('li')
	li.innerHTML = list[i]
	myList.appendChild(li)
}

document.body.appendChild(myList)

const img = document.createElement('img')

img.src = icon;
document.body.appendChild(img)
