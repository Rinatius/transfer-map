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
    transactionDateRange: {
      title: "Transaction date range",
      field: "transactionDate",
      hidden: false,
      searchable: false,
      sorting: true,
      grouping: true,
      filtering: true,
      type: 'date_range',
      defaultFilter: '',
      lookup: '',
      filterPlaceholder: 'Transaction date range',
      customSort: (a, b) => {
        return new Date(a.transactionDate) - new Date(b.transactionDate)
      },
      customFilterAndSearch: (term, rowData) => {
        if (term.dateRange == null){
          return true
        }
        const rowDate = new Date(rowData.transactionDate)
        return rowDate >= term.dateRange[0] && rowDate <= term.dateRange[1]
      }
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
      width: 66,
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
      width: 66,
    },
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
      width: 66,
      customSort: (a, b) => {
        return parseInt(a.amount) - parseInt(b.amount)
      },
      customFilterAndSearch: (term, rowData) => {
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
    },
    amount: {
      title: "Amount",
      field: "amount",
      hidden: true,
      searchable: true,
      sorting: true,
      grouping: true,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: 'currency',
      width: 66,
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
      width: 66,
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
      width: 120,
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
      width: 66,
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
      width: 66,
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
      width: 120
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
      cellStyle: {textAlign: 'center'},
      width: 66,
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
      width: 66,
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
        width: 66,
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
      fontWeight: 700,
      lineHeight: "14px"
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