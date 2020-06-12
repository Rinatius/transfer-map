
const tableOptions = {

    csvUrl: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2Fmockup.csv?alt=media&token=82d1e6d6-e634-492d-a7a7-32223735c25f',

    mapOptions: {
        "from_country": "country_from",
        "to_country": "country_to",
        "amount": "sum",
        "active_color": "#FFC0CB",
        "passive_color": "#DDD",
        "capitals": "https://gist.githubusercontent.com/erdem/8c7d26765831d0f9a8c62f02782ae00d/raw/248037cd701af0a4957cce340dabb0fd04e38f4c/countries.json"
    },

    columns: {
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
            type: 'numeric',
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
        },
        proof: {
            title: "Proof",
            field: "proof",
            hidden: false,
            searchable: true,
            sorting: true,
            grouping: true,
            filtering: false,
            lookup: {internal: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FInternal.svg?alt=media&token=ea2ac9bf-5026-45ff-8074-0e5bd08b5e8a', 
                    bank: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FBank.svg?alt=media&token=cf2d58c9-c18e-48e1-9033-8739f85a66eb', 
                    electronic: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FElectronic.svg?alt=media&token=0a7b3d35-71a8-4f46-85a0-9bf681e7c2b0',
                    customs: 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-table%2FCustoms.svg?alt=media&token=71ecfae4-1c9e-459d-82a3-e8da707dbb9d'},
            defaultFilter: '',
            type: 'image',
        },
    },
    table: {
        search: true,
        sorting: true,
        filtering: true,
        grouping: false,
        paging: true,
        pageSize: 20,

        hideFilterIcons: true,
        showTitle: false,
        pageSizeOptions: [],
        paginationType: 'stepped',
        padding: 'dense',
        searchFieldAlignment: 'left',

        searchFieldStyle: {
            width: '100%',
            height: '35px',
            boxShadow: 'inset 1px 2px 4px rgba(0, 0, 0, 0.35)',
            border: '1px solid #979797',
            backgroundColor: '#ffffff'},

        headerStyle: {
            borderWidth: 0,
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: '#931e1d',
            borderStyle: 'solid',
        },
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