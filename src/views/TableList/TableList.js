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
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [humanResourcesData, setHumanResourcesData] = useState(null);
  const [randomUsers, setRandomUsers] = useState(null);
  const [loadingHRDepartments, setLoadingHRDepartments] = useState(false);
  const [errorLoadingHRDepartments, setErrorLoadingHRDepartments] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchHumanResourceData = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);

      const data = await Promise.resolve(HumanResourcesData);
      // formate data accordingly to the Table props
      const formatData = data.departments.map((v) => [
        `${v.manager.name.first} ${v.manager.name.last}`,
        `${v.department.slice(0, 1).toUpperCase()}${v.department.slice(1)}`,
        v.location,
      ]);
      setHumanResourcesData(formatData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandomUser = useCallback(async (department) => {
    try {
      setLoadingHRDepartments(true);
      setErrorLoadingHRDepartments(false);
      const response = await fetch(`https://randomuser.me/api/?seed=${department}&results=10`);
      response.parsedBody = await response.json();
      // formate data accordingly to the Table props
      const formatData = response.parsedBody.results.map((v) => [
        v.login.uuid,
        `${v.name.first} ${v.name.last}`,
        v.dob.age,
        v.gender,
        v.location.country,
      ]);
      setRandomUsers(formatData);
    } catch (error) {
      setErrorLoadingHRDepartments(true);
    } finally {
      setLoadingHRDepartments(false);
    }
  }, []);

  const onSelectedEntity = useCallback((entity) => {
    setSelectedEntity(entity);

    if (entity === null) return;
    history.replace({
      pathname: location.pathname,
      search: `?employee=${entity[0]}&department=${entity[1]}`,
    });
  }, []);

  const onDeselectedEntity = useCallback((entity) => {
    setSelectedEntity(null);
    setSelectedRow(null);

    history.replace({
      pathname: location.pathname,
      search: "",
    });
  }, []);

  useEffect(() => {
    fetchHumanResourceData();
  }, [fetchHumanResourceData]);

  useEffect(() => {
    if (!location.search) return;

    const entity = new URLSearchParams(location.search).get("employee");
    const department = new URLSearchParams(location.search).get("department");
    setSelectedRow(entity);
    fetchRandomUser(department);
  }, [location]);

  if (loading) return "loading...";
  if (error) return "oops! Something went wrong...";

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {humanResourcesData && (
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}> Connect Mor Test </h4>
              <p className={classes.cardCategoryWhite}>In this section</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                selectedRow={selectedRow}
                tableData={humanResourcesData}
                onSelectedEntity={onSelectedEntity}
                onDeselectedEntity={onDeselectedEntity}
                tableHead={["Name", "Department", "Location"]}
              />
            </CardBody>
          </Card>
        )}
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Table on Plain Background</h4>
            <p className={classes.cardCategoryWhite}>Here is a subtitle for this table</p>
          </CardHeader>
          {errorLoadingHRDepartments && "Oops! Something went wrong"}
          <CardBody>
            {loadingHRDepartments ? (
              "loading..."
            ) : (
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Name", "Age", "Gender", "Country"]}
                tableData={randomUsers}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
