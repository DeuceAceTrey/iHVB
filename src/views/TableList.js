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
import React  from "react";
import ReactTooltip from "react-tooltip";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  
} from "reactstrap";

function Tables(props) {
  
  const Upload = (key) => {
    let data = props.tabledata[key];
    data['Processed'] = 1;
    data['Upload'] = 1;
    fetch('http://localhost:5000/data/upload', {
        method: 'POST',
        mode : 'cors',
        body:  JSON.stringify({'data' : data}),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }).then(response => response.json()).then(res => 
    {
      let result = res.data;
      props.refreshTable();
    })
  };

  const Remove = (key) => {
    let data = props.tabledata[key];
    data['Processed'] = 1;
    data['Upload'] = 0;
    fetch('http://localhost:5000/data/remove', {
        method: 'POST',
        mode : 'cors',
        body:  JSON.stringify({'data' : data}),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }).then(response => response.json()).then(res => 
    {
      //let result = res.data;
      props.refreshTable();
    })
  };
  
  
  
  const showMore = (key) => {
    console.log(props.tabledata[key]);
  }
  const getTable = () => {
    return props.tabledata.map((data, key) => {
      if(data['Processed'] ==0 || data['Upload'] == 1)
      {
        return (
          <tr>
            <td style={{width:"10%"}}>
              {data['Numar ADV']}
            </td>
            <td style={{width:"15%"}}> 
              {data['Processed'] == 0 ? "Not Processed" : (data['Upload'] == 0 ? "Removed" : "Uploaded")}
            </td>
            <td style={{width:"20%"}}>
              {data['Data limita']}
            </td>
            <td style={{width:"15%"}}>
              <Button style={{borderRadius:'20px'}} onClick={()=>{showMore(key)}} data-tip data-for={"tip" + key}><i className="tim-icons icon-simple-add"/></Button>
              <ReactTooltip id={"tip" + key} place="top" effect="solid" >
                <table>
                  <thead>
                    <th>
                      Nume institutie
                    </th>
                    <th>
                    Titlu
                    </th>
                    <th>
                    Email
                    </th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {data['Nume institutie']}
                      </td>
                      <td>
                        {data['Titlu']}
                      </td>
                      <td>
                        {data['Email']}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ReactTooltip>
            </td>
            <td style={{width:"25%",overflowWrap:"anywhere"}}>
              <a href = {data['URL']}>{data['URL']}</a>
            </td>
            <td style={{width:"15%"}}>
            {data['Processed'] == 0 ? <div><Button onClick={()=>{Upload(key)}}><i className="tim-icons icon-check-2"/></Button><Button onClick={()=>{Remove(key)}}><i className="tim-icons icon-simple-remove"/></Button></div> : (data['Upload'] == 0 ? <Button onClick={()=>{Upload(key)}}><i className="tim-icons icon-check-2"/></Button> : <Button onClick={()=>{Remove(key)}}><i className="tim-icons icon-simple-remove"/></Button>)}
              
            </td>
            
            
          </tr>
        );
        }
    });
  };

  return (
    <>
      <div className="content">
      
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4" >Result Table</CardTitle>
              </CardHeader>
              <CardBody style={{maxHeight:'400px !important',overflowY:'scroll',height:"480px"}}>
                <Table className="tablesorter" color="black" responsive >
                  <thead className="text-primary">
                    <tr>
                      <th style={{width:"10%"}}>Numar ADV</th>
                      <th style={{width:"15%"}}>Status</th>
                      <th style={{width:"20%"}}>Data limits</th>
                      <th style={{width:"15%"}}>Show more</th>
                      <th style={{width:"25%"}}>URL</th>
                      <th style={{width:"15%"}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTable()}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          {/* <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Table on Plain Background</CardTitle>
                <p className="category">Here is a subtitle for this table</p>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-center">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-center">$56,142</td>
                    </tr>
                    <tr>
                      <td>Philip Chaney</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                      <td className="text-center">$38,735</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-center">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-center">$78,615</td>
                    </tr>
                    <tr>
                      <td>Jon Porter</td>
                      <td>Portugal</td>
                      <td>Gloucester</td>
                      <td className="text-center">$98,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col> */}
        </Row>
      </div>
    </>
  );
}

export default Tables;
