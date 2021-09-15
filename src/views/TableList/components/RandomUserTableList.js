import React, { useCallback, useEffect, useState } from "react";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useLocation } from "react-router-dom";
import { CircularProgress, Typography } from "@material-ui/core";
import { firstLetterUpperCase } from "utils";

const RandomUserTableList = () => {
  const location = useLocation();
  const department = new URLSearchParams(location.search).get("department");

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRandomUser = useCallback(async (department) => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`https://randomuser.me/api/?seed=${department}&results=10`);
      response.parsedBody = await response.json();

      // formate data accordingly to the Table props
      const formatData = response.parsedBody.results.map((v) => [
        v.login.uuid,
        `${v.name.first} ${v.name.last}`,
        v.dob.age,
        firstLetterUpperCase(v.gender),
        v.location.country,
      ]);
      setData(formatData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!location.search) return;

    const department = new URLSearchParams(location.search).get("department");
    fetchRandomUser(department);
  }, [location]);

  if (loading) return <CircularProgress />;

  if (error)
    return (
      <Typography variant="h5" bold>
        Oops! Something went wrong...😞
      </Typography>
    );

  if (!loading && !data)
    return (
      <Typography variant="h5" bold>
        Select an entity to fetch the data
      </Typography>
    );

  return (
    <div style={{ width: "100%" }}>
      <Card plain>
        <CardHeader plain color="primary">
          <h4>Employees of: {department} </h4>
        </CardHeader>
        <CardBody>
          <Table
            tableData={data}
            tableHeaderColor="primary"
            tableHead={["ID", "Name", "Age", "Gender", "Country"]}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default RandomUserTableList;
