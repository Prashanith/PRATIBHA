import React, {useState, useEffect} from "react";
import Navbar from "../../global_ui/navbar/navbar";
import '../../faculty/generalFaculty/ListOfStudents/ListOfStudents.css';
import EditIcon from "@mui/icons-material/Edit";
import { getStudentData } from "../services/studentServices";
import { useAuth } from './../../context/AuthContext';

const SubjectsList = () => {
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [userDoc, setuserDoc] = useState(null);
  const { currentUser }= useAuth();
  
  const data = [
    {
      SUBJECT: "WT",
      PRA_TOPIC: "ABCDEFGH",
      STATUS: "Not Submitted",
      SUBMIT_BEFORE: "30-12-21",
    },
    {
      SUBJECT: "SE",
      PRA_TOPIC: "IJKLMNOP",
      STATUS: "Submitted for Grading",
      SUBMIT_BEFORE: "15-12-21",
    },
    {
      SUBJECT: "DAA",
      PRA_TOPIC: "QRSTUVWX",
      STATUS: "Graded",
      SUBMIT_BEFORE: "3-12-21",
    },
  ];

  async function fetchData() {
    const {document,error} =await getStudentData(currentUser.email);
    if(error==null){
      setuserDoc(document);            
    }else{
      setError(error);
    }
    setloading(false);
  }

  useEffect(() => {
    fetchData(); 
  }, )
  return (
    <div>
      <Navbar title="3_CSE_D" />
      {
        !loading?( 
          error==null?  
          <div className="sub_body">
            <table style={{ marginTop: "4.5rem" }}>
              <tr>
                <th>SUBJECT</th>
                <th>PRA TOPIC</th>
                <th>STATUS</th>
                <th>SUBMIT BEFORE</th>
                <th>EDIT</th>
              </tr>
              {data &&
                data.map((dataitem) => (
                  <tr>
                    <td>{dataitem.SUBJECT}</td>
                    <td>{dataitem.PRA_TOPIC}</td>
                    <td>{dataitem.STATUS}</td>
                    <td>{dataitem.SUBMIT_BEFORE}</td>
                    <td>
                      <EditIcon style={{ color: "rgba(11, 91, 138, 1)" }} />
                    </td>
                  </tr>
                ))}
            </table>
          </div>
          :<div>{error}</div>
        ):<div>
          loading
        </div>
      }
    </div>
  );
};

export default SubjectsList;
