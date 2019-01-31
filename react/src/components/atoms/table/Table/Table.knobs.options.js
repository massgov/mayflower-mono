/**
 * Option definitions for the Tables's enumerable properties (imported in stories)
 */
export default {
  id: 'responsive-table',
  feeTable: {
    head: {
      rows: [{
        rowSpanOffset: false,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Type'
        }, {
          heading: true,
          colspan: '',
          rowspan: '',
          text: 'Name'
        }, {
          heading: true,
          colspan: '',
          rowspan: '',
          text: 'Fee'
        }]
      }]
    },
    bodies: [{
      rows: [{
        rowSpanOffset: false,
        cells: [{
          heading: true,
          colspan: '',
          rowspan: '5',
          text: 'Freshwater Fishing'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Citizen or Non-Resident Fishing'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: '$27.50'
        }]
      }, {
        rowSpanOffset: true,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Citizen or Non-Resident Minor Fishing (Age 15-17)'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'FREE'
        }]
      }, {
        rowSpanOffset: true,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Citizen Fishing (Age 65-69)'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: '$16.25'
        }]
      }, {
        rowSpanOffset: true,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Citizen Fishing (Aged 70 or Over)'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'FREE'
        }]
      }]
    }, {
      rows: [{
        rowSpanOffset: false,
        cells: [{
          heading: true,
          colspan: '',
          rowspan: '5',
          text: 'Hunting'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Citizen Hunting'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: '$27.50'
        }]
      }, {
        rowSpanOffset: true,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Citizen Hunting, (Age 65-69)'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: '$16.25'
        }]
      }, {
        rowSpanOffset: true,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident and Non-Resident Citizen Hunting'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'FREE'
        }]
      }, {
        rowSpanOffset: true,
        cells: [{
          heading: false,
          colspan: '',
          rowspan: '',
          text: 'Resident Hunting'
        }, {
          heading: false,
          colspan: '',
          rowspan: '',
          text: '$27.50'
        }]
      }]
    }]
  }
};
