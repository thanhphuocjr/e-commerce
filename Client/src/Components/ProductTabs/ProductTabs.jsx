import React from "react";
import "./ProductTabs.scss";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabDescription from "../Tab_Description/TabDescription";
import TabDetails from "../Tab_Details/TabDetails";
import TabReviews from "../Tab_Reviews/TabReviews";



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProductTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Description" {...a11yProps(0)} />
          <Tab label="Product details" {...a11yProps(1)} />
          <Tab label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabDescription />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabDetails />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TabReviews />
      </CustomTabPanel>
    </Box>
  );
};

export default ProductTabs;
