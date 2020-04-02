
const path = require('path')
const parse = require('./parse')
const walk = require('./walk')
const transform = require('./transform')
const query = require('./query')
const process_ = require('./process')
const logger = require('./logger')()
const jetpack = require('fs-jetpack')
const utility = require('./utility')

class Document {
	
	constructor(path_, root) {
		
		this.path = this.trim_path(path_)
		this.id = path.relative(root.toString(), this.path.toString())
		this.define_stages()
	}
	
	trim_path(path_) {
		
		return utility.truncate_extensions(path_)
	}
	
	define_stages() {
		
		this.stages = [{
			extension: '.md',
			process: process_.process_md
		}, {
			extension: '.watm',
			process: process_.process_watm
		}, {
			extension: '.wat',
			process: process_.process_wat
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