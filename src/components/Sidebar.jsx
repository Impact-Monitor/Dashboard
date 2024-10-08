import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import WebhookIcon from '@mui/icons-material/Webhook';
import DatasetIcon from '@mui/icons-material/Dataset';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import InsightsIcon from '@mui/icons-material/Insights';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import PublicIcon from '@mui/icons-material/Public';
import userImg from '../assets/images/components/sidebar/user.jpg'
import { OneDimIcon, TwoDimIcon, ThreeDimIcon, MultiDimIcon, RankingIcon, AgreegationIcon, MapsIcon , GeometryIcon } from '../utils/customIcons'


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN 
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userImg}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Utkarsh Gupta
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                    Impact Monitor Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard1"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SubMenu 
              className="sidebar-submenu"
              title="Use Cases"
              icon={<WebhookIcon />}
              >
                  <Item
                    title="Use Case 1"
                    to="/dashboard"
                    icon={<AirplanemodeActiveIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Use Case 2"
                    to="/useCases"
                    icon={<ConnectingAirportsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Use Case 3"
                    to="/useCases"
                    icon={<PublicIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Features
            </Typography>
            <Item
              title="Data Management"
              to="/dataMgmt"
              icon={<DatasetIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="User Management"
              to="/userMgmt"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Aerospace Resources"
              to="/aeroRes"
              icon={<FlightTakeoffIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Functionalities
            </Typography>
            {/* <Item
              title="Graphs/ Plots"
              to="/plots"
              icon={<InsightsIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
              <SubMenu 
                className="sidebar-submenu"
                title="Graphs/ Plots"
                icon={<InsightsIcon />}
                >
                  <Item
                    title="One Dimensional"
                    to="/plots"
                    icon={<OneDimIcon/>}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Engine Plots"
                    to="/graph"
                    icon={<OneDimIcon/>}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Two Dimensional"
                    to="/plots"
                    icon={<ScatterPlotIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Three Dimensional"
                    to="/plots"
                    icon={<MultilineChartIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Multi Dimensional"
                    to="/plots"
                    icon={<MultiDimIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Ranking"
                    to="/plots"
                    icon={<RankingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Aggregation"
                    to="/plots"
                    icon={<StackedBarChartIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Maps"
                    to="/plots"
                    icon={<MapsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Geometry"
                    to="/plots"
                    icon={<GeometryIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
              </SubMenu>

            <Item
              title="Design Exploration"
              to="/designExpo"
              icon={<QueryStatsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Export/ Download"
              to="/export"
              icon={<FileDownloadIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              External Tools
            </Typography>
            <Item
              title="HAT"
              to="/hat"
              icon={<AlignVerticalCenterIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="MDAx"
              to="/mdax"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Other Links
            </Typography>
            <Item
              title="User Profile/Test"
              // to="/userProfile"
              to="/test"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="About"
              to="/about"
              icon={<InfoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ and Help"
              to="/help"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contact Us"
              to="/contact"
              icon={<ContactMailIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
