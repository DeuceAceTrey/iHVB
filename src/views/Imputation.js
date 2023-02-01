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
import React ,{useState} from 'react';
import Dropzone from "./Dropzone";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col ,Button,Input ,Table , CardTitle} from "reactstrap";

function Imputation() {

  const [results,setResults] = useState([]);
  const [isLoading , setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [libraryFile,setLibraryFile] = useState('');
  const [downloadName, setDownloadName] = useState('');
  
  const Input_panel = () => {
    
    
    // const changeURL = (e) => {
    //   setUrl(e.target.value);
    //   if(e.keyCode === '13')
    //     searchURL();
    // }
    const searchURL = () => {
      if(url !== '' && libraryFile)
      {
        const formData = new FormData();
        formData.append("url",url);
        formData.append("file", libraryFile);
        setIsLoading(true);
        fetch('http://localhost:5000/data/search', {
            method: 'POST',
            mode : 'cors',
            body: formData,
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        }).then(response => response.json()).then(res => 
        {
          setResults(res.data);
          setIsLoading(false);
        })
      }
    }

    const download = () => {
      if(downloadName !== '')
      {
        fetch('http://localhost:5000/data/download', {
            method: 'POST',
            mode : 'cors',
            body: JSON.stringify(downloadName),
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        }).then(response => response.json()).then(res => 
        {
          //toast success
          console.log(res.data);
        })
      }
    }
    
    const getFile = (file) => {
      setLibraryFile(file);
    }

    

    return(
      
      <Row >
        <Col md="6">
          <h5>Please Enter the URL you want to analyse</h5>
          <Input type="url" onChange={(e)=>setUrl(e.target.value)}  value={url} />
          
        </Col>
        <Col md="12">
          <Dropzone getFileList={(file) => getFile(file)} />
        </Col>
        <Col md ="3">
          <Button className="btn-fill" color="success" onClick={()=>searchURL()} style={{display: isLoading ? 'none' : 'block' }}>
                    Search
          </Button>
          <h5 style={{display: isLoading ? 'block' : 'none' }}>
              Searching Now ..... Just a moment
          </h5>
        </Col>
        <Col md="6">
          <Input type="text" onChange={(e)=>setDownloadName(e.target.value)}  value={downloadName} />
        </Col>
        <Col md="3">
          <Button className="btn-fill" color="danger" onClick={()=>download()}>
                    Download
          </Button>
        </Col>
        
      </Row>
        

    );
    
    
  };

  const Output_panel = () => {
    
      const trs = results.map((result,i) => (
        <tr key={result}>
          <td>{i + 1}</td>
          <td>{result['WORD']}</td>
          <td>{result['COUNTS']}</td>
          <td>{result['IMPUTATION']}</td>
        </tr>
    ));
    return(
      <Row>
        <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Result</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>No</th>
                        <th>KeyWord</th>
                        <th>Counts</th>
                        <th>Imputation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* display results */}
                      {trs}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
        
      </Row>
    );
  };


  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>Imputation Checker</CardHeader>
              <CardBody>
                <div
                  id="map"
                  className="map"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <Input_panel />
                  <Output_panel/>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Imputation;
