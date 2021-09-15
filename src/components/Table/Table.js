import React, { useState } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, onSelectedEntity } = props;
  const [selectedEntity, setSelectedEntity] = useState(null);

  const onSelect = (entity) => {
    // if it is already selected
    // unselect it;
    if (selectedEntity?.[0] === entity[0]) {
      setSelectedEntity(null);
      onSelectedEntity(null);
      return;
    }

    setSelectedEntity(entity);
    onSelectedEntity(entity);
  };

  const isRowSelected = (entity) => {
    if (!selectedEntity) return false;
    return selectedEntity[0] === entity[0];
  };

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell} />
              {tableHead.map((prop, key) => {
                return (
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} key={key}>
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <Checkbox
                  checked={isRowSelected(prop)}
                  inputProps={{
                    "aria-labelledby": `checkbox-id-for-${prop[0]
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`,
                  }}
                  onClick={() => onSelect(prop)}
                />
                {prop.map((prop, key) => {
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
