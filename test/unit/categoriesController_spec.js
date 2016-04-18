'use strict';

var assert = require('assert');
var sinon = require('sinon');
var httpResponseService = require('../../services/httpResponseService');

var mockCategories = [
  {id: 1, name: 'Foo'},
  {id: 2, name: 'Bar'}
];

var mockCategoryService = {

  create: function(data) {
    var _mockCategories = JSON.parse(JSON.stringify(mockCategories));
    _mockCategories.push({id: 3, name: data.name});
    return _mockCategories;
  },
  findAll: function() {
    return mockCategories;
  },
  findOne: function(id) {
    return [mockCategories[id - 1]];
  },
  update: function(id, data) {
    var _mockCategories = JSON.parse(JSON.stringify(mockCategories));
    _mockCategories[id - 1].name = data.name;
    return _mockCategories;
  },
  destroy: function(id) {
    var _mockCategories = JSON.parse(JSON.stringify(mockCategories));
    _mockCategories.splice(id - 1, 1);
    return _mockCategories;
  }

};

var categoriesController = require('../../controllers/categoriesController.js')(mockCategoryService, httpResponseService());

describe('Categories Controller', function() {

  it('should return an array of all categories when calling getAll', function() {

    var req = {};

    var res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    categoriesController.getAll(req, res);
    assert.ok(res.status.calledWith(200));
    assert.ok(res.send.calledWith([
      {id: 1, name: 'Foo'},
      {id: 2, name: 'Bar'}
    ]));

  });

  it('should return an array of one matching categories when calling getOne with an id', function() {

    var req = {
      params: {
        id: 1
      }
    };

    var res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    categoriesController.getOne(req, res);
    assert.ok(res.status.calledWith(200));
    assert.ok(res.send.calledWith([{id: 1, name: 'Foo'}]));

  });

  it('should return an array of all categories including the new one when posting a new category', function() {

    var req = {
      body: {
        name: 'Bazz'
      }
    };

    var res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    categoriesController.post(req, res);
    assert.ok(res.status.calledWith(200));
    assert.ok(res.send.calledWith([
      {id: 1, name: 'Foo'},
      {id: 2, name: 'Bar'},
      {id: 3, name: 'Bazz'}
    ]));

  });

  it('should return an array of all categories with updated data when updating a category', function() {

    var req = {
      body: {
        name: 'Fizz'
      },
      params: {
        id: 1
      }
    };

    var res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    categoriesController.put(req, res);
    assert.ok(res.status.calledWith(200));
    assert.ok(res.send.calledWith([
      {id: 1, name: 'Fizz'},
      {id: 2, name: 'Bar'}
    ]));


  });

  it('should return an array of all categories without the deleted category when deleting a category', function() {

    var req = {
      params: {
        id: 1
      }
    };

    var res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    categoriesController.del(req, res);
    assert.ok(res.status.calledWith(200));
    assert.ok(res.send.calledWith([
      {id: 2, name: 'Bar'}
    ]));

  });

});

