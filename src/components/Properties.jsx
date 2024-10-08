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


const Properties = (props) => {

    console.log(">->->->" + props)
    console.log(props)
    return (
        <div style={{ width: '300px', height: '100vh', backgroundColor: 'lightblue' }}>
        {props.content}
        </div>
    );
};

export default Properties;