
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
		
		this.path = utility.truncate_extensions(path_)
		this.id = path.relative(root.toString(), this.path.toString())
		this.define_stages()
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
			process: function noop() {}
		}]
	}
	
	load() {
		
		this.stages.forEach(function(stage, index) {
			let extension = this.extension(index)
			let path_ = this.path + extension
			if (this.source == null) {
				if (jetpack.exists(path_) == 'file') {
					this.source = jetpack.read(path_, 'utf8')
					this.path_absolute = path_
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
}

module.exports = Document