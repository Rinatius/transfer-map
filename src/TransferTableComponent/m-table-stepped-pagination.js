/* eslint-disable no-unused-vars */
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import * as React from 'react';
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
/* eslint-enable no-unused-vars */

class MTablePaginationInner extends React.Component {
  state = {
    sum: 0
  }

  setSum = (value) => {
    this.setState({sum: value})
  }

  formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleNumberButtonClick = number => event => {
    this.props.onChangePage(event, number);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  renderPagesButton(start, end) {
    const buttons = [];

    for (let p = start; p <= end; p++) {
      const buttonVariant = p === this.props.page ? "contained" : "text";
      buttons.push(
        <Button
          size="small"
          style={{
            boxShadow: 'none',
            maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'
          }}
          disabled={p === this.props.page}
          variant={buttonVariant}
          onClick={this.handleNumberButtonClick(p)}
          key={p}
        >
          {p + 1}
        </Button>
      );
    }

    return <span>{buttons}</span>;
  }

  render() {
    const { classes, count, page, rowsPerPage, theme, showFirstLastPageButtons } = this.props;

    const localization = { ...MTablePaginationInner.defaultProps.localization, ...this.props.localization };
    const maxPages = Math.ceil(count / rowsPerPage) - 1;

    const pageStart = Math.max(page - 1, 0);
    const pageEnd = Math.min(maxPages, page + 1);

    return (
      <div>
      <Box className={classes.root} style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}>
      <div style={{ }}>
      {showFirstLastPageButtons &&
        <Tooltip title={localization.firstTooltip}>
            <span>
              <IconButton
                  onClick={this.handleFirstPageButtonClick}
                  disabled={page === 0}
                  aria-label={localization.firstAriaLabel}
              >
                {theme.direction === 'rtl' ? <this.props.icons.LastPage /> : <this.props.icons.FirstPage />}
              </IconButton>
            </span>
        </Tooltip>
        }
        <Tooltip title={localization.previousTooltip}>
          <span>
            <IconButton
              onClick={this.handleBackButtonClick}
              disabled={page === 0}
              aria-label={localization.previousAriaLabel}
            >
              <this.props.icons.PreviousPage />
            </IconButton>
          </span>
        </Tooltip>
        <Hidden smDown={true}>
          {this.renderPagesButton(pageStart, pageEnd)}
        </Hidden>
        <Tooltip title={localization.nextTooltip}>
          <span>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= maxPages}
              aria-label={localization.nextAriaLabel}
            >
              <this.props.icons.NextPage />
            </IconButton>
          </span>
        </Tooltip>
      {showFirstLastPageButtons &&
        <Tooltip title={localization.lastTooltip}>
            <span>
              <IconButton
                  onClick={this.handleLastPageButtonClick}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label={localization.lastAriaLabel}
              >
                {theme.direction === 'rtl' ? <this.props.icons.FirstPage /> : <this.props.icons.LastPage />}
              </IconButton>
            </span>
        </Tooltip>
      }
      </div>
        <Typography variant="body2" style={{
          position: "absolute",
          right: "5%",
          marginTop: "12px",
          color: "#515151",
          }}>Total of filtered results: <span style={{fontWeight: "700"}}>$ {this.formatMoney(this.state.sum)}</span></Typography>
      </Box>
      <Typography className={classes.root} variant="body2"
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          color: "#515151",
        }}
        >Showing {this.props.page * this.props.rowsPerPage + 1} to {(this.props.count - (this.props.page + 1) * this.props.rowsPerPage > 0)
          ? ((this.props.page + 1) * this.props.rowsPerPage) 
          : (this.props.count)} of {this.props.count} ({this.props.totalNumOfRows})</Typography>
      </div>
    );
  }
}

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5)
  }
});

MTablePaginationInner.propTypes = {
  onChangePage: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  classes: PropTypes.object,
  localization: PropTypes.object,
  theme: PropTypes.any,
  showFirstLastPageButtons: PropTypes.bool
};

MTablePaginationInner.defaultProps = {
  showFirstLastPageButtons: true,
  localization: {
    firstTooltip: 'First Page',
    previousTooltip: 'Previous Page',
    nextTooltip: 'Next Page',
    lastTooltip: 'Last Page',
    labelDisplayedRows: '{from}-{to} of {count}',
    labelRowsPerPage: 'Rows per page:'
  }
};

const MTableSteppedPagination = withStyles(actionsStyles, { withTheme: true })(MTablePaginationInner);

export default MTableSteppedPagination;
