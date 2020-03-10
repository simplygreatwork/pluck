
const path = require('path')
const parse = require('./parse')
const walk = require('./walk')
const transform = require('./transform')
const query = require('./query')
const process = require('./process')
const logger = require('./logger')()
const jetpack = require('fs-jetpack')

class Document {
	
	constructor(path_) {
		
		this.path = this.trim_path(path_)
		this.name = path.basename(this.path)
		this.id = this.name.split('.')[0]
		this.define_stages()
	}
	
	trim_path(path_) {
		
		let array = path_.split('.')
		if (array.length > 0) {
			return array[0]
		} else {
			return path_
		}
	}
	
	define_stages() {
		
		this.stages = [{
			extension: '.md',
			process: process.process_md
		}, {
			extension: '.watm',
			process: process.process_watm
		}, {
			extension: '.wat',
			process: process.process_wat
		}]
	}
	
	load() {
		
		this.stages.forEach(function(stage, index) {
			let extension = this.extension(index)
			logger('document').log('extension: ' + extension)
			let path_exact = this.path + extension
			logger('document').log('path_exact: ' + path_exact)
			if (this.source == null) {
				this.source = this.load_file(path_exact)
				if (this.source != null) {
					logger('document').log('loaded: ' + path_exact)
				}
			}
			if (this.source != null) {
				stage.process(this)
			}
		}.bind(this))
	}
	
	extension(index_) {
		
		let result = []
		this.stages.forEach(function(each, index) {
			if (index >= index_) {
				result.unshift(each.extension)
			}
		})
		return result.join('')
	}
	
	load_file(path_) {
		
		if (jetpack.exists(path_) == 'file') {
			return jetpack.read(path_, 'utf8')
		} else {
			return null
		}
	}
}

module.exports = Document