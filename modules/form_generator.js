// MIT License
// Copyright Tomáš Novák <tomasnovak@tonova.sk>

exports.id = 'FormGenerator';
exports.version = '1.0.0';

function FormGenerator(options) {
	this.form = [];
	this.schemaName = options.schemaName || false;
	this.schemaFlag = options.schemaFlag;
	this.includeValidation = options.includeValidation;
	this.jcomponent = options.isJcomponent;
	this.jcomponentPath = options.jcomponentPath;
	this.jcomponentIcon = options.jcomponentIcon;
	this.translateLabel = options.translateLabel;
	this.translatePrefix = options.translatePrefix;
	this.placeholder = options.placeholder;
	this.customAttr = options.customAttr;
}

FormGenerator.prototype.parseSchema = function(callback) {
	var self = this;

	if(!self.schemaName) {
		callback({success: false, error: 'Schema not defined'});
		return;
	}

	if(!self.schemaFlag) {
		callback({success: false, error: 'Schema flag must be defined'});
		return;
	}

	var schema = GETSCHEMA(self.schemaName).schema;

	if(schema === undefined) {
		callback({success: false, error: 'Schema not found'});
		return;
	}

	var form = [];

	Object.keys(schema).forEach(function(key) {

		if((self.schemaFlag !== schema[key].custom) && (self.schemaFlag !== '*'))
			return;

  		form.push({name: key, schema: schema[key]});
	});

	
	form.forEach(function(r) {

		var label = r.name;
		var type = '';
		var customAttr = '';
		var validation = '';
		var placeholder = '';
		var jcomponentPath = '';
		var jcomponentIcon = '';
		var render = '';

		// 2: Number
		// 3: String
		// 4: Boolean
		// 5: Date
		// 6: Array
		// 7: Object
		switch(parseInt(r.schema.type)) {
			case 2:
				type = (self.jcomponent === 'true' ? ' data-component="textbox"' : ' type="number"');
				break;
			case 3:
				type = (self.jcomponent === 'true' ? ' data-component="textbox"' : ' type="text"');
				break;
			case 4:
				type = (self.jcomponent === 'true' ? ' data-component="dropdown"' : 'select');
				break;
			case 5:
				type = (self.jcomponent === 'true' ? ' data-component="calendar"' : ' type="text"');
				break;
			case 6:
				type = (self.jcomponent === 'true' ? ' data-component="dropdown"' : 'select');
				break;
			case 7:
				type = (self.jcomponent === 'true' ? ' data-component="dropdown"' : 'select');
				break;
			default:
				type = (self.jcomponent === 'true' ? ' data-component="textbox"' : ' type="text"');
		}

		if(self.translateLabel === 'true')
			label = '@(' + self.translatePrefix + r.name + ')';

		if(self.jcomponentPath)
			jcomponentPath = ' data-component-path="'+ self.jcomponentPath + '"';

		if((self.includeValidation === 'true') && r.schema.required)
			validation = (self.jcomponent === 'true' ? ' data-required="true"' : ' required');

		if(self.placeholder === 'true')
			placeholder = (self.jcomponent === 'true' ? ' data-placeholder="' + label + '"' : 'placeholder="' + label + '"');

		if(self.jcomponentIcon)
			jcomponentIcon = ' data-control-icon="' + self.jcomponentIcon + '"';

		if(self.customAttr)
			customAttr = ' ' + self.customAttr;

		if(self.jcomponent === 'true') {

			switch(parseInt(r.schema.type)) {
				case 4:
					render += '<div' + type + jcomponentPath + validation + placeholder + jcomponentIcon + customAttr + ' data-options=";Yes|1;No|0"' + '>' + label + '</div>';
					break;
				default:
					render += '<div' + type + jcomponentPath + validation + placeholder + jcomponentIcon + customAttr + '>' + label + '</div>';
			}
		}

		if(self.jcomponent !== 'true') {

			render += '<label>' + label + '</label>\n';

			switch(type) {
				case 'select':
					render += '<select' + validation + customAttr + '>' + (parseInt(r.schema.type) === 4 ? '<option value="true">True</option><option value="false">False</option>' : '') + '</select>';
					break;
				default:
					render += '<input' + type + placeholder + validation + customAttr + '>';
			}
		}

		self.form.push(render);
	});

	callback(SUCCESS(true, self.form));
}

module.exports = FormGenerator;