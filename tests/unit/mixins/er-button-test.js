import Ember from 'ember';
import ErButtonMixin from 'ember-remodal/mixins/er-button';
import { module, test } from 'qunit';

module('Unit | Mixin | er button');

const ErButtonObject = Ember.Object.extend(ErButtonMixin, {
  buttonType: 'test',
  _assertModalIsNested() {}
});

const ModalMock = Ember.Component.extend({
  actionCalled: false,
  actions: {
    test() {
      this.set('actionCalled', true);
    }
  }
});

test('it works', function(assert) {
  let ErButtonObject = Ember.Object.extend(ErButtonMixin);
  let subject = ErButtonObject.create();
  assert.ok(subject);
});

test('it calls "_registerWithModal" on didRender', function(assert) {
  let thing = ErButtonObject.create();
  thing.set('registerCalled', false);
  thing.set('_registerWithModal', () => thing.set('registerCalled', true));

  Ember.run(() => thing.didRender());
  assert.ok(thing.get('registerCalled'));
});

test('"_registerWithModal" calls "_getModal"', function(assert) {
  let mixin = ErButtonObject.create();
  mixin.set('getModalCalled', false);
  mixin.set('_getModal', () => {
    mixin.set('getModalCalled', true);
    return Ember.Object.create();
  });

  Ember.run(() => {
    assert.notOk(mixin.get('getModalCalled'));
    mixin._registerWithModal();
    assert.ok(mixin.get('getModalCalled'));
  });
});

test('"_registerWithModal" properly sets the button\'s name on the modal', function(assert) {
  let mixin = ErButtonObject.create();

  mixin.set('_getModal', () => Ember.Object.create());

  Ember.run(() => {
    assert.notOk(mixin.get('modal.erTestButton'));
    mixin._registerWithModal();
    assert.ok(mixin.get('modal.erTestButton'));
  });
});

test('"_registerWithModal" throws an error when modal is not set', function(assert) {
  let mixin = ErButtonObject.create();
  mixin.set('getModalCalled', false);

  mixin.set('_getModal', () => {
    mixin.set('getModalCalled', true);
    return null;
  });

  Ember.run(() => assert.throws(mixin._registerWithModal));
});

test('"name" is computed based on "buttonType"', function(assert) {
  let mixin = ErButtonObject.create();
  Ember.run(() => assert.equal(mixin.get('name'), 'er-test-button'));
});

test('"click()" sends an action named the same as "buttonType"', function(assert) {
  let mixin = ErButtonObject.create();

  mixin.set('modal', ModalMock.create());

  Ember.run(() => {
    assert.notOk(mixin.get('modal.actionCalled'));
    mixin.click();
    assert.ok(mixin.get('modal.actionCalled'));
  });
});
