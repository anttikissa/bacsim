let x = 1
let log = console.log

log(x)

// time

function parseTime(hhmm) {
	let match = hhmm.match(/^(\d+):(\d+)$/)
	if (!match) {
		throw new Error('not a time: ' + hhmm)
	}

	let [ _, hh, mm ] = match
	return [ hh, mm ]

}

function pad2(n) {
	n = String(n)
	while (n.length < 2) {
		n = '0' + n
	}
	return n
}

function unparseTime(hh, mm) {
	return `${pad2(hh)}:${pad2(mm)}`
}

function addMinutes(hhmm, minutes) {
	let [hh, mm] = parseTime(hhmm)
	hh = Number(hh)
	mm = Number(mm)
	mm += minutes
	while (mm >= 60) {
		hh++
		mm -= 60
	}
	return unparseTime(hh, mm)

}

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

function addDrink(time, cl, abv, minutes = 10) {
	let alcohol = cl * abv / 100
	let alcoholPerMinute = roundTo4(alcohol / minutes)
	for (let i = 0; i < minutes; i++) {
		addData(addMinutes(time, i), alcoholPerMinute)
	}
}

addDrink('10:00', 33.3, 4.7, 10)
addDrink('10:05', 12, 13, 20)

// for (let i = 0; i < 100; i++) {
// 	log(addMinutes('23:34', i))
// }

log(getData())
