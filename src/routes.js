/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Patrons from "layouts/patrons";
import Tables from "layouts/tables";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import PeopleIcon from "@mui/icons-material/People";
import StaffAndFunerals from "layouts/staff-and-funerals";
import Funerals from "layouts/funerals";
import MorgueFridges from "layouts/morgue-fridges";
import TransportLogistics from "layouts/transport-logistics";
import DeathRegistration from "layouts/death-registration";
import PDFFormFiller from "layouts/death-registration/components/PDFFormFiller";
import FillPDFForm from "layouts/death-registration/components/FillPDFForm";
import EditablePDFViewer from "layouts/death-registration/components/EditablePDFViewer";
import DocusealFormComponent from "layouts/death-registration/components/DocusealFormComponent";
import TombstoneOrderForm from "layouts/tombstone-orders/components/TombstoneOrderForm";
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Funerals",
    key: "funerals",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/funerals",
    component: <Funerals />,
  },
  {
    type: "collapse",
    name: "Death Registration",
    key: "death-registration",
    icon: <Icon fontSize="small">person_add</Icon>,
    route: "/death-registration",
    component: <DocusealFormComponent />,
  },
  {
    type: "collapse",
    name: "Tombstone Orders",
    key: "tombstone-orders",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/tombstone-orders",
    component: <TombstoneOrderForm />,
  },
  {
    type: "collapse",
    name: "Morgue Fridges",
    key: "morgue-fridges",
    icon: <Icon fontSize="small">ac_unit</Icon>, // Use an appropriate icon; `ac_unit` can resemble a fridge.
    route: "/morgue-fridges",
    component: <MorgueFridges />,
  },
  {
    type: "collapse",
    name: "Transport Logistics",
    key: "transport-logistics",
    icon: <Icon>local_shipping</Icon>,
    route: "/transport-logistics",
    component: <TransportLogistics />,
  },
  {
    type: "collapse",
    name: "Patrons",
    key: "patrons",
    route: "/patrons",
    icon: <PeopleIcon />,
    component: <Patrons />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    name: "Profile",
    key: "profile",
    route: "/profile",
    component: <Profile />, // This ensures the route works
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
