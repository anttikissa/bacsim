// Documentation:
// http://www.sumsar.net/blog/2014/07/estimate-your-bac-using-drinkr/

let log = console.log

// time

let constants = {
	weight: 87,
	height: 173,
	sex: 'male',
	// in promilles per hour
	eliminationRatePerHour: 0.18
}

// constants = {
// 	weight: 60,
// 	height: 160,
// 	sex: 'female',
// }

function computeWidmark(victim) {
	let result

	if (!victim.weight || !victim.height) {
		throw new Error('victim must have weight & height')
	}

	if (victim.sex === 'male') {
		result = 0.32 - 0.0048 * victim.weight + 0.0046 * victim.height
		if (result < 0.6) {
			result = 0.6
		}
		if (result > 0.87) {
			result = 0.87
		}
		return result
	}

	if (victim.sex === 'female') {
		result = 0.31 - 0.0064 * victim.weight + 0.0045 * victim.height
		if (result < 0.44) {
			result = 0.44
		}
		if (result > 0.8) {
			result = 0.8
		}
		return result
	}

	// Unknown sex? Use the average!
	return (
		0.5 *
		(computeWidmark({ ...victim, sex: 'male' }) +
			computeWidmark({ ...victim, sex: 'female' }))
	)
}

function parseTime(hhmm) {
	let match = hhmm.match(/^(\d+):(\d+)$/)
	if (!match) {
		throw new Error('not a time: ' + hhmm)
	}

	let [_, hh, mm] = match
	return [hh, mm]
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

// Return data in array format
function convertSetToArray(set) {
	let keys = [...set.keys()]

	return keys.map(key => [key, set.get(key)])
}

function addAlcoholIntake(time, grams) {
	let obj = dataPoints.get(time)
	if (!obj) {
		obj = {}
		dataPoints.set(time, obj)
	}

	if (typeof obj.alcoholIntake === 'number') {
		obj.alcoholIntake += grams
	} else {
		obj.alcoholIntake = grams
	}
}

// function roundTo(n, decimals) {
// 	let multiplier = Math.pow(10, decimals)
// 	return Math.round(n * multiplier) / multiplier
// }

function addDrink(time, cl, abv, minutes = 10) {
	let alcoholDensityGramsPerMl = 0.7893
	let ml = cl * 10
	let alcoholVolumeMl = (ml * abv) / 100
	let alcoholGrams = alcoholVolumeMl * alcoholDensityGramsPerMl
	let alcoholPerMinute = alcoholGrams / minutes
	for (let i = 0; i < minutes; i++) {
		addAlcoholIntake(addMinutes(time, i), alcoholPerMinute)
	}
}

function simulate() {
	let victim = constants
	let widmarkFactor = computeWidmark(victim)

	log('Widmark is', widmarkFactor.toFixed(4))

	let inputData = convertSetToArray(dataPoints)
	inputData.sort((a, b) => {
		return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
	})

	let firstTime = inputData[0][0]
	let lastTime = inputData[inputData.length - 1][0]

	// In grams
	let stomachAlcoholContent = 0
	// In grams
	let bacAbsolute = 0
	// As parts of 1/1000 (promilles) relative to the weight
	// Expressed in promilles since the formula used to calculate this divides
	// a g value by a kg value.
	let bacRelative = 0

	// Steps, i.e. minutes
	let alcoholHalfLifeInStomach = 8

	function simulateStep(intake) {
		// 1. Simulate elimination (from blood) by changing bacRelative
		// and backporting results to bacAbsolute
		let bacRatio = 1
		if (bacAbsolute > 0 && bacRelative > 0) {
			bacRatio = bacAbsolute / bacRelative
		}
		bacRelative = bacRelative - victim.eliminationRatePerHour / 60
		if (bacRelative < 0) {
			bacRelative = 0
		}
		bacAbsolute = bacRatio * bacRelative

		// 2. Simulate absorption (from stomach to blood)
		let absorptionRatio = 1 - Math.pow(0.5, 1 / alcoholHalfLifeInStomach)
		let absorption = absorptionRatio * stomachAlcoholContent
		stomachAlcoholContent -= absorption
		bacAbsolute += absorption

		bacRelative = bacAbsolute / (widmarkFactor * victim.weight)

		// 3. Simulate consumption (alcohol entering stomach)
		stomachAlcoholContent += intake
	}

	let countdown = 0

	for (let i = 0;; i++) {
		if (addMinutes(firstTime, i) === lastTime) {
			countdown++
		}

		if (countdown) {
			if (countdown++ > 30) {
				if (bacRelative < 0.001) {
					break
				}
			}
		}
		let time = addMinutes(firstTime, i)
		let input = dataPoints.get(time)
		let intake = input ? input.alcoholIntake : 0
		simulateStep(intake)
		log(time, {
			in: intake.toFixed(4),
			sto: stomachAlcoholContent.toFixed(4),
			blo: bacAbsolute.toFixed(4),
			bac: bacRelative.toFixed(4),
		})
	}
}

// 4cl shot jaloviina - roughly 12 grams of alcohol
// addDrink('10:00', 4, 38, 1)
// addDrink('10:10', 4, 38, 1)
// addDrink('10:10', 4, 38, 1)
// addDrink('10:10', 4, 38, 1)

// addDrink('10:00', 4.5, 40, 1)
// addDrink('10:10', 4.5, 40, 1)
// addDrink('10:20', 4.5, 40, 1)
// addDrink('10:30', 4.5, 40, 1)

// addDrink('10:00', 33.3, 2.8, 10)
// addDrink('10:30', 33.3, 2.8, 10)
// addDrink('11:00', 33.3, 2.8, 10)
// addDrink('11:30', 33.3, 2.8, 10)
// addDrink('12:00', 33.3, 2.8, 10)

// // 12cl 12.5% abv wine
// addDrink('10:05', 12, 12.5, 15)
//
// // 33cl 4.6% beer
// addDrink('10:10', 33.3, 4.6, 15)

function doit(time) {
	addDrink(time, 33.3, 4.7, 10)
}

// addDrink('10:00', 33.3, 2.8, 10)

doit('11:00')
doit('11:45')
doit('12:30')
doit('14:00')
doit('15:00')
doit('15:45')
doit('16:45')
doit('17:30')
doit('18:45')
doit('19:30')
doit('20:15')
doit('21:15')
doit('22:00')

simulate()
