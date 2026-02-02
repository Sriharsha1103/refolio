import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector} from 'react-redux'
import Login from './Login'
import Register from './Register'
import Forgot from './Forgot'
import { useEffect } from 'react'
import { Tab } from '../store/Actions';


function Main(){
    const a=useSelector(state=>state.Page)
    const dispatch=useDispatch();
    useEffect(()=>{
      dispatch(Tab('login'));
    },[])
    console.log(a);
    return(
      <>
        <Box sx={{
            height: "88vh",
            width: "100vw",
            backgroundColor: "#c5d299",
            pt: "65px",
            display: "flex",
            justifyContent: "center",
            // alignItems: "center"
        }}>
          <Card sx={{ maxHeight:580, maxWidth: 900, width: '100%', boxShadow: 3, borderRadius: 2 }}>
            <Grid container sx={{ height: '100%' }}>

              <Grid item xs={12} md={6}>
                <Box
                    component="img"
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                    src={require('../static/hompage.jpg')}
                    alt="Homepage"
                />
              </Grid>

              <Grid item xs={12} md={6} >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%'
                }}>
                  
                  {a==="Forgot"?<Forgot/>:(a==='Register'?<Register/>:<Login/>)}
                </Box>
              </Grid>

            </Grid>
          </Card>
        </Box>
    </>
    )
}

export default Main;