'use strict';

var expect = chai.expect;

describe('TableFilter class', () => {

  it('should be a constructor function', () => {
    expect(TableFilter).to.be.a('function');
  });

  it('should throw an error if no DOM table is used in constructor', () => {

    expect(() => { return new TableFilter() })
      .to.throw('You must provide a table DOM element');

    expect(() => { return new TableFilter('') })
        .to.throw('You must provide a table DOM element');

    expect(() => { return new TableFilter(document.querySelector('body')) })
        .to.throw('You must provide a table DOM element');

  });

  it('should return a valid table object for DOM table', () => {

    expect(() => { return new TableFilter(document.getElementById('test-table')) })
      .to.not.throw('You must provide a table DOM element');

  });

  describe('allRows property', () => {

    var table;

    beforeEach(() => {
      table = new TableFilter(document.getElementById('test-table'));
    });

    it('should return an html collection', () => {

      expect(table.allRows).to.be.an('object');
      expect(table.allRows.length).to.eql(12);

    });

  });

  describe('rows property', () => {

    var table;

    beforeEach(() => {
      table = new TableFilter(document.getElementById('test-table'));
    });

    afterEach(() => {
      table = null;
    });

    it('should return an html collection', () => {

      expect(table.rows).to.be.an('object');
      expect(table.rows.length).to.eql(11);

    });

  });

  describe('row method', () => {

    var table;

    beforeEach(() => {
      table = new TableFilter(document.getElementById('test-table'));
    });

    it('should return a single row', () => {

      expect(table.row()).to.be.eql(null);
      expect(table.row(1)).to.be.an('object');
      expect(table.row(1000)).to.eql(null);

    });

  });

  describe('sort method', () => {

    var table;
    var tableDOM;

    beforeEach(() => {
      table = new TableFilter(document.getElementById('test-table'));
      tableDOM = document.getElementById('test-table');
    });

    afterEach(() => {
      table = null;
    });

    it('should not sort invalid column', () => {
      expect(table.sort()).to.eql(false);
      expect(table.sort('test')).to.eql(false);
    });

    it('should sort valid column', () => {
      expect(tableDOM.querySelector('tbody tr td').innerHTML).to.eql('robsco');
      table.sort(0, true);
      expect(tableDOM.querySelector('tbody tr td').innerHTML).to.eql('billys co');
    });

    it('should set css class on header', () => {
      table.sort(0, true);
      expect(Array.prototype.slice.call(tableDOM.querySelector('thead tr th').classList)).to.include('asc');
    });

    it('should sort a numeric column', () => {
      table.sort(2, false);
      expect(tableDOM.querySelectorAll('tbody tr td')[2].innerHTML).to.eql('100');
      table.sort(2, true);
      expect(tableDOM.querySelectorAll('tbody tr td')[2].innerHTML).to.eql('10');
      table.sort(2, false);
      expect(tableDOM.querySelectorAll('tbody tr td')[2].innerHTML).to.eql('100');
    });

  });

});
