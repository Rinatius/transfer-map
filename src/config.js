const tableOptions = {

  csvUrl: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2Fmockup.csv?alt=media&token=82d1e6d6-e634-492d-a7a7-32223735c25f',

  mapOptions: {
    "active_color": "#dbabac",
    "passive_color": "#DDD",
    "focus_color": "#bd3d3f",
    "label_text_style": {
      fill: '#ffffff',
      fontSize: '12px',
      fontWeight: '900',
      letterSpacing: '-0.26px'
    },
    "capitals": "https://gist.githubusercontent.com/erdem/8c7d26765831d0f9a8c62f02782ae00d/raw/248037cd701af0a4957cce340dabb0fd04e38f4c/countries.json"
  },

  columns: {
    numberRange: {
      title: "Amount range",
      field: "amount",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      type: 'number_range',
      defaultFilter: '',
      lookup: '',
      filterPlaceholder: '',
      customFilterAndSearch: (term, rowData) => {
        console.log('greater: ' + term.greaterThan)
        console.log('less: ' + term.lessThan)
        console.log('rowData: ' + rowData.amount)
        // this allows search to work
        if (term[0] != null) {
          return rowData[0] == term[0]
        }
        // there must be a better way to compare
        if (term.greaterThan != null && term.lessThan != null) {
          return term.greaterThan <= parseInt(rowData.amount)
            && term.lessThan >= parseInt(rowData.amount)
        } else if (term.greaterThan != null && term.lessThan == null) {
          return term.greaterThan <= parseInt(rowData.amount)
        } else if (term.greaterThan == null && term.lessThan != null) {
          return term.lessThan >= parseInt(rowData.amount)
        } else {
          return true
        }
      },
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      }
    },
    transactionDate: {
      title: "Transaction date",
      field: "transactionDate",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      type: 'date',
      defaultFilter: '',
      lookup: '',
      filterPlaceholder: 'Transaction date',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    paidBy: {
      title: "Paid by",
      field: "paidBy",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'Payer...',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    paidTo: {
      title: "Paid to",
      field: "paidTo",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'Recipient...',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    amount: {
      title: "Amount",
      field: "amount",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: 'currency',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    fromCountry: {
      title: "From Country",
      field: "fromCountry",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'From country',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    country: {
      title: "Country",
      field: "country",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'To country...',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    purpose: {
      title: "Purpose",
      field: "purpose",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    type: {
      title: "Type",
      field: "type",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      cellStyle: {
        width: '50px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    bankSender: {
      title: "Bank sender",
      field: "bankSender",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'Bank...',
      cellStyle: {
        width: '114px',
        height: '19px',
        color: '#515151',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        letterSpacing: '-0.3px',
      },
    },
    confidence: {
      title: "Confidence",
      field: "confidence",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: false,
      lookup: {confirmed: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FConfirmed.svg?alt=media&token=60873b2f-26ed-4c14-b210-8f5467709e1c'},
      defaultFilter: '',
      type: 'image',
      cellStyle: {textAlign: 'center',}
    },
    proof: {
      title: "Proof",
      field: "proof",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: false,
      lookup: {
        internal: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FInternal.svg?alt=media&token=ea2ac9bf-5026-45ff-8074-0e5bd08b5e8a',
        bank: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FBank.svg?alt=media&token=cf2d58c9-c18e-48e1-9033-8739f85a66eb',
        electronic: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FElectronic.svg?alt=media&token=0a7b3d35-71a8-4f46-85a0-9bf681e7c2b0',
        customs: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FCustoms.svg?alt=media&token=71ecfae4-1c9e-459d-82a3-e8da707dbb9d'
      },
      defaultFilter: '',
      type: 'image',
      cellStyle: {textAlign: 'center'}
    },
    story: {
        title: "Story",
        field: "story",
        hidden: true,
        searchable: true,
        sorting: true,
        grouping: true,
        filtering: true,
        defaultFilter: '',
        lookup: '',
        type: '',
        filterPlaceholder: 'Story...',
      },
  },
  table: {
    search: true,
    sorting: true,
    filtering: true,
    grouping: false,
    paging: true,
    pageSize: 20,

    textBody: 'Explore the dataset of transactions below:',

    hideFilterIcons: true,
    showTitle: false,
    pageSizeOptions: [],
    paginationType: 'stepped',
    padding: 'dense',
    searchFieldAlignment: 'left',
    searchFieldVariant: 'standard',
    loadingType: 'overlay',
    draggable: false,

    searchFieldStyle: {
      width: '100%',
      height: '35px',
      boxShadow: 'inset 1px 2px 4px rgba(0, 0, 0, 0.35)',
      border: '1px solid #979797',
      backgroundColor: '#ffffff',
    },

    headerStyle: {
      borderWidth: 0,
      borderTopWidth: 2,
      borderBottomWidth: 2,
      borderColor: '#931e1d',
      borderStyle: 'solid',
      width: '80px',
      height: '29px',
      color: '#515151',
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '-0.3px',
      lineHeight: '14px',
    },

    rowStyle: {
      height: '37px',
    }
  }
}


// myJSON = JSON.stringify(tableOptions,null, 4);
export default tableOptions

// export default tableOptions


//     console.log(myJSON)
//     console.log(typeof(myJSON))


// let objJSON = JSON.parse(myJSON);
//     console.log(objJSON)
//     console.log(typeof(objJSON))    

// let newJSON = JSON.stringify(objJSON,null, 4);
//     console.log(newJSON)
//     console.log(typeof(newJSON))