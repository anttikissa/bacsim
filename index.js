let x = 1
let log = console.log

log(x)

let dataPoints = new Map()

function getData() {
	let keys = [...dataPoints.keys()]

	return keys.map(key => [
		key,
		{
			n: dataPoints.get(key).n.toFixed(4)
		}
	])
}

function addData(time, n) {
	let obj = dataPoints.get(time)
	if (!obj) {
		obj = {}
		dataPoints.set(time, obj)
	}

	if (typeof obj.n === 'number') {
		obj.n += n
	} else {
		obj.n = n
	}
}

addData('12:34', 5)
addData('12:35', 5)
addData('12:35', 5)
addData('12:36', 5)
addData('12:37', 5)
addData('12:38', 5)
addData('12:39', 5)

addData('12:34', 5)
addData('12:35', 6)
addData('12:35', 7)

addData('12:40', 0)
addData('12:40', 1)

function roundTo4(n) {
	return Math.round(n * 10000) * 0.0001
}

function addDrink(time, cl, abv, minutes = 1) {
	let alcohol = cl * abv / 100
	let alcoholPerMinute = roundTo4(alcohol / minutes)
	addData(time, alcoholPerMinute)
}

addDrink('10:00', 33.3, 4.7)
addDrink('10:05', 12, 13)

log(getData())
