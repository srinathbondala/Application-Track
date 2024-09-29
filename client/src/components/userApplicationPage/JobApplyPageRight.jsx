import {  Paper, Box, Typography, Button} from '@mui/material';
import ShowProfileCompletion from './ShowProfileCompletion';
import axios from 'axios';
import {useEffect, useState} from "react";
function JobApplyPageRight({jobId}) {
  const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem('Details');
    if (userDetails) {
      const userDetailsJson = JSON.parse(userDetails);
      if (userDetailsJson.acadamicDetailsKey !==null && userDetailsJson.profactionalDetailsKey !==null) {
        setAreAllFieldsValid(true);
      }
      userDetailsJson.jobApplicationKeys.forEach((jobApplicationKey) => {
        if (jobApplicationKey == jobId) {
          setAlreadyApplied(true);
        }
      });
    }
  }, []);
  const applyJobByUser =async ()=>{
      try {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post('http://localhost:8080/user/apply-job', { jobId }, config);
        console.log('Job applied successfully:', response.data);
        const userDetails = JSON.parse(localStorage.getItem('Details'));
        userDetails.jobApplicationKeys.push(jobId);
        localStorage.setItem('Details', JSON.stringify(userDetails));
        alert(response.data.message);
        navigation(-1);
        return response.data;
      } catch (error) {
          console.log(error);
          // console.error('Error applying for the job:', error.response ? error.response.data.error : error.message);
          throw error;
      }
    }
  return (
    <Paper elevation={3} sx={{ p: 2 ,flexGrow: 1, bgcolor: 'white', minWidth: '200px',borderRadius: 1}}>
        <Box sx={{textAlign:"center"}}>
            <Typography variant="h6" align="center" gutterBottom> Apply For Job</Typography>
            <hr />
            {(areAllFieldsValid && !alreadyApplied) ? (<Button variant="contained" color="primary" fullWidth onClick={()=>{applyJobByUser(); }}>Apply</Button>) : (<>{alreadyApplied ?(<Typography variant="body1" align="center" sx={{color:"green"}} gutterBottom>Already Applied</Typography>):(<ShowProfileCompletion />) }</>)}   
        </Box>
    </Paper>
  );
}
export default JobApplyPageRight;