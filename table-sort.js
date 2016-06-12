'use strict';

class TableFilter {

  /**
  * Constructor
  * @param {HTMLTableElement}
  */
  constructor (table) {

    if (!table || table.constructor === undefined || table.constructor.name !== 'HTMLTableElement') {
      throw 'You must provide a table DOM element';
    }

    this.table = table;
    this.tbody = table.querySelector('tbody');
    this.bodyRows = this.table.querySelectorAll('tbody tr');
    this.sortableHeaders = {};
    this.headers = this.table.querySelectorAll('thead th');

    //set up events on headers
    (function () {

      let sort;
      let headers = this.headers;

      //for each header
      for (let i = 0; i < headers.length; i++) {

        sort = 'alpha';

        //if data attribute
        if (headers[i].dataset && headers[i].dataset.sort) {
          sort = headers[i].dataset.sort;
        } else {
          continue;
        }

        //add to sortable list
        this.sortableHeaders[headers[i].cellIndex] = {
          index: headers[i].cellIndex,
          name: headers[i].innerHTML.toLowerCase().replace(' ', '-'),
          domElement: headers[i],
          type: sort,
          direction: 0,
          state: ''
        };

        //save state for toggle
        (function (index) {
          let toggle = false;
          index.addEventListener('click', function (el) {
            this.sort(el.target.cellIndex, toggle);
            this.toggleClass(el.target.cellIndex, toggle);
            toggle = !toggle;
          }.bind(this), false);
        }.bind(this)(headers[i]));

      }

    }.bind(this)());

  }

  toggleClass (current, direction) {
    for (var i in this.sortableHeaders) {
      this.sortableHeaders[i].domElement.classList.remove('asc');
      this.sortableHeaders[i].domElement.classList.remove('desc');
    }

    this.sortableHeaders[current].domElement.classList.add((direction ? 'asc' : 'desc'));
  };

  get allRows () {
    return this.table.rows;
  }

  get rows () {
    return this.bodyRows;
  }

  row (index) {
    return this.bodyRows[index] || null;
  }

  /**
   * Sort the table based on the column heading and direction (optional)
   * @param heading {}
   * @param direction {}
   * @return bool
   */
  sort (heading, direction) {

    let header;
    let rows = [];

    if (!this.bodyRows.length) {
      return false;
    }

    if (!(heading in this.sortableHeaders)) {
      return false;
    }

    header = this.sortableHeaders[heading];

    for (let i = 0; i < this.bodyRows.length; i++) {
      rows.push(this.bodyRows[i]);
    }

    if (header.type === 'alpha') {

      rows.sort((a, b) => {
        a = a.cells[header.index].innerHTML.toLowerCase();
        b = b.cells[header.index].innerHTML.toLowerCase();
        if (direction) {

          if (a < b) {
            return -1;
          }

          if (a > b) {
            return 1;
          }

          return 0;

        } else {
          if (a < b) {
            return 1;
          }

          if (a > b) {
            return -1;
          }

          return 0;
        }
      });

    } else {
      rows.sort((a, b) => {
        a = a.cells[header.index].innerHTML;
        b = b.cells[header.index].innerHTML;
        return (direction) ? a - b : b - a;
      });
    }

    for (let i = 0; i < rows.length; i++) {
      this.tbody.appendChild(rows[i]);
    }

    this.toggleClass(header.index, direction);

    return true;

  }

}
