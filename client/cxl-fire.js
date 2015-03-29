
(function(cxl, _, $, Backbone) {

/**
 * Two way Binding for firebase objects.
 *
 * options:
 *
 * el   DOM element or jQuery selector
 * ref  Firebase reference
 *
 */
cxl.Binding = function(options)
{
	this.el = $(options.el);
	this.ref = options.ref;
	this._onComplete = this.onComplete.bind(this);
	this.setViewHandlers();
	this.bind();
};

cxl.bind = function(op)
{
	return new cxl.Binding(op);
};

_.extend(cxl.Binding, {

	setView: {
		value: function(val) { return this.el.val(val); },
		checkbox: function(val)
		{
			var value = this.el.attr('value') || true;
			return this.el.prop('checked', value===val);
		}
	},

	getView: {
		value: function() { return this.el.val(); },
		checkbox: function()
		{
			var val = this.el.attr('value') || true;
			return this.el.prop('checked') ? val : false;
		}
	}

});

_.extend(cxl.Binding.prototype, Backbone.Events, {

	/**
	 * DOM element or jQuery selector.
	 */
	el: null,

	/**
	 * Firebase reference
	 */
	ref: null,

	/**
	 * Current Model value
	 */
	value: null,

	/**
	 * Current View value
	 */
	viewValue: null,

	setViewHandlers: function()
	{
	var
		type = this.el.attr('type')
	;
		this.setViewValue = cxl.Binding.setView[
			type==='checkbox' ? 'checkbox': 'value'
		];
		this.getViewValue = cxl.Binding.getView[
			type==='checkbox' ? 'checkbox': 'value'
		];
	},

	unbind: function()
	{
		this.ref.off('value', this.onModelChange, this);
		this.el.off('change', this._ovc);
	},

	bind: function()
	{
		this.ref.on('value', this.onModelChange, this);
		this._ovc = this.onViewChange.bind(this);
		this.el.on('change input', this._ovc);
	},

	onModelChange: function(snapshot)
	{
		this.value = snapshot.val();
		this.setViewValue(this.value);
		this.trigger('sync');
	},

	onViewChange: function()
	{
		var val = this.getViewValue();

		if (this.value!==val)
			this.ref.set(val, this._onComplete);
		else if (this.viewValue!==val)
			this.trigger('sync');

		this.viewValue=val;
	},

	// Binded handler
	_onComplete: null,

	onComplete: function(err)
	{
		if (err)
			this.trigger('error', err);
	}


});

cxl.Validation = {

	Messages: {
		json: 'Invalid JSON.',
		required: 'Field is required'
	},

	Validators: {

		json: function(value)
		{
			try {
				if (value!=="")
					JSON.parse(value);
			} catch(e) {
				return false;
			}
			return true;
		},

		required: function(value)
		{
			return (value!==undefined && value!==null && value!=="");
		}
	}

};


})(this.cxl, this._, this.jQuery, this.Backbone);