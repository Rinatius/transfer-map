const defaultLegendTitleStyle = {
  paddingLeft: '6px', 
  height: '19px',
  color: '#515151',
  fontFamily: "Open Sans",
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '-0.3px',}

const defaultLegendBodyStyle = {
  height: '44px',
  color: '#515151',
  fontFamily: "Open Sans",
  fontSize: '14px',
  letterSpacing: '-0.3px',
}
const defaultLegendBoxStyle = {
  paddingLeft: '25px',
  paddingRight: '25px'
}

const tableOptions = {

  csvUrl: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-map%2Fmockup_v3.csv?alt=media&token=3294afb4-be79-487a-938e-e919b7969230',

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
      grouping: false,
      filtering: true,
      type: 'date_range',
      defaultFilter: '',
      lookup: '',
      filterPlaceholder: 'Transaction date range',
      width: 66,
      customSort: (a, b) => {
        return new Date(a.transactionDate) - new Date(b.transactionDate)
      },
      customFilterAndSearch: (term, rowData) => {
        if (term.dateRange == null){
          return true
        }
        const rowDate = new Date(rowData.transactionDate)
        return rowDate >= term.dateRange[0] && rowDate <= term.dateRange[1]
      },
      cellStyle: {paddingLeft: 20},
      headerStyle: {paddingLeft: 20}
    },
    paidBy: {
      title: "Paid by",
      field: "paidBy",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: false,
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
      grouping: false,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'Recipient...',
      width: 66,
    },
    amount: {
      title: "Amount",
      field: "amount",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: false,
      filtering: true,
      type: 'number_range',
      defaultFilter: '',
      lookup: '',
      filterPlaceholder: '',
      width: 20,
      render: rowData => {return '$' + rowData.amount},
      customSort: (a, b) => {
        return parseInt(a.amount) - parseInt(b.amount)
      },
      customFilterAndSearch: (term, rowData) => {
        // this allows search to work
        if (term[0] != null) {
          return rowData[0] == term[0]
        }
        if (!term.greaterThan) {
          term.greaterThan = ''
        }
        if (!term.lessThan) {
          term.lessThan = ''
        }
        console.log(rowData)
        console.log(term)
        // there must be a better way to compare
        if (term.greaterThan != '' && term.lessThan != '') {
          return term.greaterThan <= parseInt(rowData.amount)
            && term.lessThan >= parseInt(rowData.amount)
        } else if (term.greaterThan != '' && term.lessThan == '') {
          return term.greaterThan <= parseInt(rowData.amount)
        } else if (term.greaterThan == '' && term.lessThan != '') {
          return term.lessThan >= parseInt(rowData.amount)
        } else {
          return true
        }
      },
    },
    fromCountry: {
      title: "From Country",
      field: "fromCountry",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: false,
      filtering: false,
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
      grouping: false,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'To country...',
      width: 66,
    },
    purpose: {
      title: "Purpose",
      field: "purpose",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: false,
      filtering: false,
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
      grouping: false,
      filtering: false,
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
      grouping: false,
      filtering: true,
      defaultFilter: '',
      lookup: '',
      type: '',
      filterPlaceholder: 'Bank...',
      width: 60
    },
    confidence: {
      title: "Confidence",
      field: "confidence",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: false,
      filtering: false,
      lookup: {confirmed: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FConfirmed.svg?alt=media&token=60873b2f-26ed-4c14-b210-8f5467709e1c'},
      defaultFilter: '',
      type: 'image',
      cellStyle: {textAlign: 'center'},
      width: 30,
    },
    proof: {
      title: "Proof",
      field: "proof",
      hidden: false,
      searchable: true,
      sorting: true,
      grouping: false,
      filtering: false,
      imgLink: {
        internal: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FInternal.svg?alt=media&token=ea2ac9bf-5026-45ff-8074-0e5bd08b5e8a',
        bank: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FBank.svg?alt=media&token=cf2d58c9-c18e-48e1-9033-8739f85a66eb',
        electronic: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FElectronic.svg?alt=media&token=0a7b3d35-71a8-4f46-85a0-9bf681e7c2b0',
        customs: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FCustoms.svg?alt=media&token=71ecfae4-1c9e-459d-82a3-e8da707dbb9d'
      },
      linkColumn: 'proofLink',
      defaultFilter: '',
      type: 'image-link',
      width: 30,
      cellStyle: {textAlign: 'center', paddingRight: 20}
    },
    story: {
        title: "Story",
        field: "story",
        hidden: true,
        searchable: true,
        sorting: true,
        grouping: false,
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
    },

    filterBoxStyle: {
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingBottom: '10px',
      paddingTop: 'none'
    },
    
    filterCellStyle: {
      fontFamily: "Open Sans",
      fontSize: "14px",
      padding: "none",
      width: "90px",
    }
  },

  legend: {
    confirmed: {
      img:'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FConfirmed.svg?alt=media&token=60873b2f-26ed-4c14-b210-8f5467709e1c',
      title: 'Confirmed',
      body: "Confirmed by U.S. Bank Records",
      titleStyle: defaultLegendTitleStyle,
      bodyStyle: defaultLegendBodyStyle,
      boxStyle: defaultLegendBoxStyle
    },
    internal: 
      {
        img:'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FInternal.svg?alt=media&token=ea2ac9bf-5026-45ff-8074-0e5bd08b5e8a',
        title: 'Internal',
        body: "Saimati’s internal documents (spreadsheet)",
        titleStyle: defaultLegendTitleStyle,
        bodyStyle: defaultLegendBodyStyle,
        boxStyle: defaultLegendBoxStyle
      },
    bank: 
      {
        img:'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FBank.svg?alt=media&token=cf2d58c9-c18e-48e1-9033-8739f85a66eb',
        title: 'Bank transfer',
        body: "Scanned PDF of hard copies of bank transfer",
        titleStyle: defaultLegendTitleStyle,
        bodyStyle: defaultLegendBodyStyle,
        boxStyle: defaultLegendBoxStyle
      },
    electronic: 
      {
        img:'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FElectronic.svg?alt=media&token=0a7b3d35-71a8-4f46-85a0-9bf681e7c2b0',
        title: 'Electronic transfer',
        body: "Electronic PDF copies of bank transfer",
        titleStyle: defaultLegendTitleStyle,
        bodyStyle: defaultLegendBodyStyle,
        boxStyle: defaultLegendBoxStyle
      },
    customs: 
      {
        img:'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FCustoms.svg?alt=media&token=71ecfae4-1c9e-459d-82a3-e8da707dbb9d',
        title: 'Customs',
        body: "Customs’ declaration form as scanned PDF",
        titleStyle: defaultLegendTitleStyle,
        bodyStyle: defaultLegendBodyStyle,
        boxStyle: defaultLegendBoxStyle
      }
    },

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