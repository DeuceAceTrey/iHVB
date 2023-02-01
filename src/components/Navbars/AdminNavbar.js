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
import React, { useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  NavbarToggler,
  ModalHeader,
  Label
} from "reactstrap";

function AdminNavbar(props) {
  const [collapseOpen, setcollapseOpen] = React.useState(false);
  const [modalSearch, setmodalSearch] = React.useState(false);
  const [color, setcolor] = React.useState("navbar-transparent");
  const [curtime,setCurtime] = React.useState('')
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  React.useEffect(() => {
    const interval = setInterval(() => {
      let today = new Date();
      setCurtime(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '  ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor("navbar-transparent");
    } else {
      setcolor("bg-white");
    }
    setcollapseOpen(!collapseOpen);
  };
  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setmodalSearch(!modalSearch);
  };

  // const dateChange = (date) => {
  //   props.getDate(date);
    
  // }
  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg" light={true} >
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {/* {props.brandText} */}
              <img src={require("assets/img/Logo_png.png")} style={{width:'120px',height:'80px'}}></img>
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen} style={{justifyContent:'center'}}>
            <Nav  navbar >
              <InputGroup className="search-bar" style={{justifyContent:'center',alignItems:'center'}}>
                <i className="tim-icons icon-calendar-60"></i>
                <Input type={"date"} value={props.date} onChange={(e)=>{props.getDate(e.target.value)}}>
                </Input>
              </InputGroup>
              <InputGroup className="search-bar" style={{justifyContent:'center',alignItems:'center'}}>
                <Label>
                  <i className="tim-icons icon-sound-wave">Scrapping</i>                  
                </Label>
              </InputGroup>
              <InputGroup className="search-bar" style={{justifyContent:'center',alignItems:'center'}}>
                <Label style={{width:"200px",marginBottom:"0px",fontSize:"16px"}}>
                  Last Found : {props.last_dav}                  
                </Label>
              </InputGroup>
              <InputGroup className="search-bar" style={{justifyContent:'center',alignItems:'center'}}>
                <Label style={{width:"200px",marginBottom:"0px",fontSize:"16px"}}>
                      {curtime}              
                </Label>
              </InputGroup>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      
    </>
  );
}

export default AdminNavbar;
