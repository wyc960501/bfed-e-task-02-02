import { name, age } from './module.js'

console.log(name,age)

name = 'tom'

setTimeout(function () {
    console.log(name,age)
},1500)