import { Bezier } from '../dist/bezier.js'

let p0 = { x: 364, y: 5 }
let p1 = { x: 40,  y: 440 }
let p2 = { x: 880, y: 480 }
let p3 = { x: 587, y: 165 }

let _p0 = { x: 364 - 100, y: 5 }
let _p1 = { x: 40,  y: 440 }
let _p2 = { x: 880 - 200, y: 480 }
let _p3 = { x: 587 - 200, y: 165 }

let bezier  = new DBezier(p0, p1, p2, p3)
let bezier2 = new DBezier(_p0, _p1, _p2, _p3)
// let line = { p1: { x: 200, y: 300 }, p2: { x: 700, y: 150 } }

console.log(bezier.length())

// console.log(bezier.intersects(line))