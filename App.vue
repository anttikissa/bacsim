<template>
	<div class="App">
		<div class="menu">
			<div v-if="error" class="error">
				!
			</div>
			<div v-if="warning" class="warning">
				?
			</div>
			<a href="Input" @click.prevent="page = 'input'">Input</a>
			<a href="Output" @click.prevent="page = 'output'">Output</a>
			<div class="abv">
				{{ abv }}
			</div>
		</div>

		<div class="page">
			<div v-if="page === 'input'" class="input">
				<label>
					Time CL ABV
				</label>
				<textarea v-model="input"
						  @input="inputChanged()"
						  @change="inputChanged()">
				</textarea>
			</div>

			<div v-if="page === 'output'" class="output">
				<pre>{{ output }}</pre>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import {
	reset, addDrink, simulate,
	parseTime,
	unparseTime


} from './bac'

let log = console.log

export default Vue.extend({
	data() {
		return {
			page: 'input',
			input: [
				'11:00 33.3 4.7',
				'11:45 33.3 4.7',
				'12:30 33.3 4.7',
				'14:00 33.3 4.7',
				'15:00 33.3 4.7',
				'15:45 33.3 4.7',
				'16:45 33.3 4.7',
				'17:30 33.3 4.7',
				'18:45 33.3 4.7',
				'19:30 33.3 4.7',
				'20:15 33.3 4.7',
				'21:15 33.3 4.7',
				'22:00 33.3 4.7',
			].join('\n'),
			error: false
		}
	},

	computed: {
		abv(...args) {
			let now = new Date()

			let hhmm = unparseTime(now.getHours(), now.getMinutes())

			function normalizeTime(hhmm) {
				let [ hh, mm ] = parseTime(hhmm)
				while (hh >= 24) {
					hh -= 24
				}
				return unparseTime(hh, mm)
			}
			let result

			for (let simulationResult of this.simulationResults) {
				let normalizedTime = normalizeTime(simulationResult.time)
				if (normalizedTime === hhmm) {
					result = simulationResult.bacRelative.toFixed(3)
				}
			}

			return result || 0
		},
		simulationResults() {
			reset()

			this.warning = false
			this.error = false

			let lines = this.input.split('\n').filter(Boolean)

			try {
				for (let line of lines) {
					let [ time, cl, abv, minutes ] = line.split(' ')
					if (!time || !cl || !abv) {
						this.warning = true
						continue
					}

					cl = Number(cl)
					abv = Number(abv)
					minutes = Number(minutes)

					if (minutes) {
						addDrink(time, cl, abv, minutes)
					} else {
						addDrink(time, cl, abv)
					}
				}
			} catch (err) {
				log('Got err', err)
				this.error = true
				return []
			}

			let result = simulate()
			// this.error = false
			return result
		},

		output() {
			let results = this.simulationResults.map(result => {
				let line = `${result.time}: ${result.bacRelative.toFixed(3)}`
				if (result.description) {
					line += ', ' + result.description
				}
				return line
			})

			return results.join('\n')
		}
	},

	methods: {
		inputChanged() {
			log('!!! input changed', this.input)
		},

		clickety() {
			simulate()

			log('!!! input', this.input)

			this.page = this.page === 'input' ? 'output' : 'input'
		},
	},
})
</script>

<style lang="stylus" scoped>

* {
	box-sizing: border-box
}

.App {
	height: 100%

	.menu {
		min-height: 50px
	}

	.page {
		height: calc(100% - 50px)
		margin: 0 5px
	}

	font-family: -apple-system, sans-serif
}

.menu {
	text-align: center
	border-bottom: 1px solid #888

	a {
		text-decoration: none
		padding: 5px 10px
		border-radius: 16px
		color: #444
		text-transform: uppercase
		font-size: 20px
		line-height: 50px
		&:hover {
			color: #000
			background: #eee
		}
	}

	.error, .warning {
		position: absolute
		line-height: 30px
		left: 10px
		top: 10px
		height: 30px
		width: 30px
		color: red
		font-weight: bold
		background: rgba(255, 0, 0, 0.3)
		border-radius: 15px
	}

	.warning {
		background: rgba(255, 255, 0, 0.6)
		color: #880
	}

	.abv {
		position: absolute
		line-height: 30px
		right: 10px
		top: 10px
		height: 30px
		/*width: 30px*/
		color: black
	}
}


.page {
	.input {
		height: 100%
		label {
			font-family: -apple-system, sans-serif
			height: 24px
			line-height: 24px
		}
		textarea {
			font-family: -apple-system, Monaco, monospace
			font-size: 40px
			width: 100%
			height: calc(100% - 10px - 24px)

			outline: none;
		}
	}

	.output {
		> pre {
			/*font-family: monospace, -apple-system, Monaco, monospace*/
			font-family: sans-serif
			font-variant-numeric: tabular-nums
			font-size: 16px
			width: 100%
			margin-top: 5px
			height: calc(100% - 10px)

			outline: none;
		}
	}
}
</style>
