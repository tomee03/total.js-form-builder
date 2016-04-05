exports.install = function() {

	F.route('/form-generator/', form_generator_action, ['xhr', 'post'])
	F.route('/form-generator/', form_generator)
}

function form_generator() {
	var self = this;
	self.layout('');
	self.view('form-generator');
}

function form_generator_action() {
	var self = this;

	var FormGenerator = MODULE('FormGenerator');

	var options = self.body;
	var generator = new FormGenerator(options);
	generator.parseSchema(function(data) {
		self.json(data);
	});
}