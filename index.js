let x = 1
let log = console.log

log(x)

let dataPoints = new Map()

function getData() {
	let keys = [...dataPoints.keys()]
	log('keys', keys)
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

log(getData())
