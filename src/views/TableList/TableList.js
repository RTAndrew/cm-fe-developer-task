/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import HumanResourcesData from "assets/data/HR.json";
import { useHistory, useLocation } from "react-router-dom";
import RandomUserTableList from "./components/RandomUserTableList";
import { Typography, CircularProgress } from "@material-ui/core";
import { firstLetterUpperCase } from "utils";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  randomUsers: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [humanResourcesData, setHumanResourcesData] = useState(null);

  const fetchHumanResourceData = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);

      const data = await Promise.resolve(HumanResourcesData);
      // formate data accordingly to the Table props
      const formatData = data.departments.map((v) => [
        `${v.manager.name.first} ${v.manager.name.last}`,
        firstLetterUpperCase(v.department),
        v.location,
      ]);
      setHumanResourcesData(formatData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSelectedEntity = useCallback((entity) => {
    if (entity === null) return;

    history.replace({
      pathname: location.pathname,
      search: `?employee=${entity[0]}&department=${entity[1]}`,
    });
  }, []);

  useEffect(() => {
    fetchHumanResourceData();
  }, [fetchHumanResourceData]);

  useEffect(() => {
    if (!location.search) return;

    const entity = new URLSearchParams(location.search).get("employee");
    setSelectedRow(entity);
  }, [location]);

  if (loading) return <CircularProgress />;
  if (error || !humanResourcesData)
    return <Typography variant="h6"> Oops! Something went wrong... 😞 </Typography>;

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}> Connect Mor Aptitude Test </h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              selectedRow={selectedRow}
              tableData={humanResourcesData}
              onSelectedEntity={onSelectedEntity}
              tableHead={["Name", "Department", "Location"]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <div className={classes.randomUsers}>
          <RandomUserTableList />
        </div>
      </GridItem>
    </GridContainer>
  );
}
