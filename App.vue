<template>
	<div id="App">
		<h1>Hello {{content}}</h1>

		<button @click="simulate()">Click me</button>
	</div>
</template>

<script>
import Vue from 'vue'
import { simulate } from './bac'

export default Vue.extend({
	data() {
		return {
			content: 'Jeejee!'
		}
	},
	
	methods: {
		simulate() {
			simulate()
		}
	}
})
</script>

<style lang="stylus" scoped>
.App {
	color: green
}
</style>
