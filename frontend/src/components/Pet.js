import React from 'react'
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, ButtonBase, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Pet = ({ pet, onDelete }) => {
    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    });
    const navigate = useNavigate();
    const update_pet = () => {
        // console.log(pet.id);
        const redirectURL = '/pets/editProfile/' + pet.id;
        navigate(redirectURL, {state: {from: 'shelterManagement'}});
    };

    return (
        <Paper sx={{ p: 2, margin: 'auto', mb: 2, mt: 2, maxWidth: 900, flexGrow: 1, background: '#F8F8F8'}}>
            <Grid container spacing={5}>
                <Grid item>
                    <ButtonBase sx={{ width: 175, height: 175 }}>
                        <Img alt="complex" src={pet.image} />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h5" component="div">
                                {pet.name}
                            </Typography>
                            <Typography variant="body1">
                                Type: {pet.type}
                            </Typography>
                            <Typography variant="body1">
                                Age: {pet.age}
                            </Typography>
                            <Typography variant="body1">
                                Sex: {pet.sex}
                            </Typography>
                            <Typography variant="body1">
                                Breed: {pet.breed}
                            </Typography>
                            <Typography variant="body1">
                                Availability: {pet.availability}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} container direction="column" justifyContent="center" alignItems="center">
                        <Grid item p={2}>
                            <Button variant="contained" onClick={update_pet}>Update</Button>
                        </Grid>
                        <Grid item p={2}>
                            <Button variant="contained" color="error" onClick={() => onDelete(pet.id)}>Delete</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Pet
