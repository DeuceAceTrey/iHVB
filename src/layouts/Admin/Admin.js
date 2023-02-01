/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React,{useState} from "react";
import { Route, Switch, Redirect, useLocation,Alert,  UncontrolledAlert } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import Tables from "views/TableList.js"
import routes from "routes.js";

import logo from "assets/img/react-logo.png";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import { Button } from "reactstrap";

var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [curdate,setDate] = useState('');
  const [keywords,setKeywords] = useState('');
  const [tabledata,setTabledata] = useState([]);
  const [last_adv,setLastadv] = useState('');
  const [curtime,setCurtime] = useState('');
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );
  const notificationAlertRef = React.useRef(null);
  const [i,setI] = useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      let today = new Date();
      if(today.getHours() >=8 && today.getHours() <= 20)
        find();
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  const getTableContent = (date=curdate,keys=keywords) => {
    console.log(curdate,keywords);
    fetch('http://localhost:5000/data/getdata', {
        method: 'POST',
        mode : 'cors',
        body:  JSON.stringify({'date' : date, 'keywords' : keys}),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }).then(response => response.json()).then(res => 
    {
      console.log(res.data['data']);
      setTabledata(res.data['data']);
      setLastadv(res.data['last_adv'])
    })
  };
  
  const showToast = (place,type,message) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true
      });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);
  const find = () => {
    console.log(curdate,keywords);
    fetch('http://localhost:5000/data/find', {
        method: 'POST',
        mode : 'cors',
        body:  JSON.stringify({'keywords' : keywords}),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }).then(response => response.json()).then(res => 
    {
      getTableContent(curdate,keywords);
    })
  
  };
  //this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const changeDate = (chddate) => {
    console.log(chddate);
    setDate(chddate);
    console.log(curdate)
    getTableContent(chddate);
  };
  return (
    <BackgroundColorContext.Consumer>
      
      {({ color, changeColor }) => (
        <React.Fragment>
          <div className="wrapper">
            {/* <Sidebar
              routes={routes}
              logo={{
                outterLink: "https://www.creative-tim.com/",
                text: "Creative Tim",
                imgSrc: logo
              }}
              toggleSidebar={toggleSidebar}
            /> */}
            <div className="main-panel" ref={mainPanelRef} data={color} >
            <NotificationAlert ref={notificationAlertRef} />
              <AdminNavbar
                brandText={getBrandText(location.pathname)}
                getDate = {changeDate}
                date = {curdate}
                last_dav = {last_adv}
                time = {curtime}
                getdata = {getTableContent}
              />
              <Tables
                tabledata = {tabledata}
                refreshTable = {getTableContent}
              ></Tables>
              {<Button onClick={find}>Test</Button> }
              <Switch>
                {getRoutes(routes)}
                <Redirect from="*" to="/admin/dashboard" />
              </Switch>
                <Footer fluid getKeywords={setKeywords} keywords={keywords} getdata={getTableContent}/>
              
            </div>
          </div>
          <FixedPlugin bgColor={color} handleBgClick={changeColor} />
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

export default Admin;
