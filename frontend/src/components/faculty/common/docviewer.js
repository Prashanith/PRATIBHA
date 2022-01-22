import * as React from "react";
import { Spinner, Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { getStorage, ref, getMetadata } from "firebase/storage";
import { storage } from "../../../firebase";
import { useEffect,useState } from "react";
import Download from "../../global_ui/download/download";
import { Component } from 'react';
// import logger from 'logging-library';
import FileViewer from 'react-file-viewer';
// import { CustomErrorComponent } from 'custom-error';

class MyComponent extends Component {
  render() {
    return (
      <FileViewer
        fileType={this.props.type} 
        filePath={this.props.object}
        errorComponent={<h1>fuhhgueihg</h1>}
        onError={this.onError}/>
    );
  }
}



const ViewPPT=({object})=>{
    useEffect(() => {
        console.log(object);
    }, [])
    
    const linkToPPTFile =
      "https://storage.googleapis.com/slidescarnival_powerpoints/Paulina%20%C2%B7%20SlidesCarnival.pptx";
    return (
        <>
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${object}`}
             width="100%"
             height="500px"
            frameBorder="0"
            title="slides"
          ></iframe>
        </>
      );
}

const ViewImage=({object})=>{
    useEffect(() => {
        console.log("vamos mahitha");
    }, [])
    return(
        <img height="510"
        style={{backgroundSize:'contain',height:'100%',width:'100%'}} src={object} alt="Unable to Load"/>
    );
}
const ViewVideo=({object})=>{
    return(
        <video width="100%" height="500px" controls >
            <source src={object} />
        </video>
    );
}

const ViewPdf=({object})=>{
    // console.log(object);
    return(
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            {
                object ? (
                    <div
                        style={{
                            border: '3px dotted rgba(0, 0, 0, 0.3)',  
                            paddingTop:'30px',  
                            backgroundColor: '#fff',
                            width: '100%',
                            height:"600px"
                        
                        }}>
                        <Viewer fileUrl={object}  />
                    </div>
                ) : (
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        fontSize: '2rem',
                        height: '100%',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    File Cannot be previewed
                </div>
            )}
        
        </Worker>
    );    
}

function Docviewer({link,rollNo}){
    const forestRef = ref(storage,link);  

    const [extension, setextension] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        // console.log(link);
        // console.log("XYZ");
        getMetadata(forestRef)
        .then((metadata) => {
            //console.log(metadata.contentType);
            setextension(metadata.contentType.split("/")[1]);
            setloading(false);
        })
        .catch((error) => {
            // console.log(error,1010);
            setextension(null)
            setloading(false);
        });
    }, [link])

    

    return (
        extension!=null?
        <div style={{width:'100%',display:'flex',flexDirection:"column",justifyContent:'center',alignItems:'center'}}>
            <Module extension={extension} object={link}/>
            <div style={{marginTop:'16px'}}>
                {
                    link !== null ? (
                    <Download url={link} userID={rollNo} isIcon={false}/>
                    ) : (
                    <div className="notSubmitted" >{`PRA not submitted yet`}</div>
                    )
                }
            </div>
        </div>
        :
        <div>
            {
                loading?<Spinner radius={2}/>:
                <div>Unknown Error Occured</div>
            }                                  
        </div>        
    )      
}

function Module({extension,object}) {
    // console.log(extension,1010);
    switch(extension){
        case 'pdf':
            return <ViewPdf object={object} />
        case 'vnd.openxmlformats-officedocument.presentationml.presentation':
            return <ViewPPT object={object}/>
        case 'vnd.ms-powerpoint':
            return <ViewPPT object={object}/>
        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
            return <div style={{height:'60vh'}}><MyComponent object={object} type="docx"/></div>
        case 'jpeg':
            return <img src={object} alt="Done" style={{width:'100%',backgroundSize:'contain'}}/>
        case 'jpg':
            return <img src={object} alt="Done" style={{width:'100%',backgroundSize:'contain'}}/>
        case 'png':
            return <ViewImage object={object}/>
        case 'mp4':
        case 'avi':
        case "mov":
        case 'm4v':
            return <ViewVideo object={object}/>
        default:return (
                <p>File Extension Not Supported</p>
            );        
    }
}

export default Docviewer;


