
(function() {

var
	fb = new Firebase('https://cxl-test.firebaseio.com')
;

QUnit.module('cxl-binding');

QUnit.test('cxl.Binding#constructor', function(a) {
var
	done = a.async(),
	el = $('<INPUT type="text" name="test">'),
	b = cxl.bind({ el: el, ref: fb.child('cxl-binding/string') })
;
	a.ok(b);
	a.equal(el.val(), '');

	b.on('sync', function() {
		a.equal(el.val(), 'string');
		b.unbind();
		done();
	});
});

QUnit.test('cxl.Binding#setView checkbox', function(a) {
var
	done = a.async(),
	el = $('<input type="checkbox">'),
	b = cxl.bind({ el: el, ref: fb.child('cxl-binding/bool') })
;
	a.equal(b.setViewValue, cxl.Binding.setView.checkbox);
	a.equal(el.prop('checked'), false);

	b.on('sync', function() {
		a.equal(el.prop('checked'), true);
		b.unbind();
		done();
	});
});

QUnit.test('cxl.Binding#getView text', function(a) {
var
	done = a.async(),
	el = $('<input type="text">'),
	b = cxl.bind({ el: el, ref: fb.child('cxl-binding/var') }),
	count = 0
;
	b.on('sync', function() {
		if (count++===0)
		{
			a.equal(b.value, 'world');
			el.val('hello').change();
		} else
		{
			a.equal(el.val(), 'hello');
			a.equal(b.value, 'hello');
			b.unbind();
			done();
		}
	});

	el.val('world').change();
});

QUnit.test('cxl.Binding#getView checkbox', function(a) {
var
	done = a.async(),
	el = $('<input type="checkbox">'),
	b = cxl.bind({ el: el, ref: fb.child('cxl-binding/varbool') }),
	count=0
;
	a.equal(b.getViewValue, cxl.Binding.getView.checkbox);
	a.equal(el.prop('checked'), false);

	b.on('sync', function() {
		if (count++===0)
		{
			a.equal(b.value, 'hello');
			a.equal(el.prop('checked'), false);
			// Run change twice to test value check
			el.attr('value', 'hello').prop('checked', true).change().change();
		} else
		{
			a.equal(b.value, 'hello');
			a.equal(el.prop('checked'), true);
			b.unbind();
			done();
		}
	});

});

QUnit.test('cxl.Binding#unbind', function(a) {
var
	el = $('<input type="text">'),
	b = cxl.bind({ el: el, ref: fb.child('cxl-binding/var') })
;
	b.unbind();
	a.ok(b);
});

QUnit.test('cxl.Binding write error', function(a) {
var
	done = a.async(),
	el = $('<input type="checkbox">'),
	b = cxl.bind({ el: el, ref: fb.child('cxl-binding/bool') })
;
	a.ok(b);
	el.prop('checked', false).change();

	b.on('error', function(err) {
		a.ok(err);
		a.equal(el.prop('checked'), true);
		b.unbind();
		done();
	});
});

})();