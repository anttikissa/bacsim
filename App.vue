<template>
	<div class="App">
		<div class="menu">
			<a href="Input" @click.prevent="page = 'input'">Input</a>
			<a href="Output" @click.prevent="page = 'output'">Output</a>
		</div>

		<div class="page">
			<div v-if="page === 'input'" class="input">
				<label for="textarea-input">Input data:</label>
				<textarea id="textarea-input" v-model="input"
						  @input="inputChanged()"
						  @change="inputChanged()">
				</textarea>
			</div>

			<div v-if="page === 'output'" class="output">
				Right page
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { simulate } from './bac'

let log = console.log

export default Vue.extend({
	data() {
		return {
			page: 'input',
			input: [
				'12:00 33.3 4.7',
				'12:30 33.3 4.7',
				'12:50 33.3 4.7', ''
			].join('\n'),
			content: 'Jeejee!',
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
		height: 30px
	}

	.page {
		height: calc(100% - 30px)
		margin: 0 5px
	}

	font-family: sans-serif
}

.menu {
	text-align: center
	border-bottom: 1px solid #888
	min-height: 32px

	a {
		text-decoration: none
		padding: 5px 10px
		border-radius: 16px
		color: #444
		text-transform: uppercase
		font-size: 14px
		line-height: 32px
		&:hover {
			color: #000
			background: #eee
		}
	}
}

.page {
	.input {
		height: 100%
	}

	.input label {
		height: 24px
		line-height: 24px
	}
	.input textarea {
		font-family: monospace
		font-size: 14px
		width: 100%
		height: calc(100% - 24px)

		outline: none;
	}
}
</style>
