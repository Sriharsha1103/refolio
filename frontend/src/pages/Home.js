import React, { useEffect } from 'react';
import { Box, Card, CardMedia, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tab } from '../store/Actions';


function Home() {
  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(Tab('home'));
    console.log("LOGGED IN", loggedIn, verify);

    if (loggedIn && !verify) {
      navigate("../verify");
    }
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '88vh',
          width: '100vw',
          backgroundColor: '#c5d299',
          paddingTop: '35px',
        }}
      >
        <Card sx={{ maxHeight: 650, maxWidth: 1200, width: '100%', borderRadius: 2, boxShadow: 3 }}>
          <Grid container>

            <Grid item md={8} xs={12}>
              <CardMedia
                component="img"
                sx={{ height: 650, width: '100%', objectFit: 'cover' }}
                image={require('../static/hompage.jpg')}
                alt="Homepage"
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  p: 2
                }}
              >
                <Typography variant="h4" sx={{ color: '#6C9449', fontSize: 35 }}>
                  Research Publications Portfolio
                </Typography>
              </Box>
            </Grid>

          </Grid>
        </Card>
      </Box>
    </>
  );
}

export default Home;