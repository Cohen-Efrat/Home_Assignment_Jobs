import React, {useState} from "react";
import {Button, TextField, Typography, Grid} from "@material-ui/core";
import {Alert} from '@material-ui/lab';


export default function AddJobForm({onSubmit}) {
    const [subject, setSubject] = useState('');
    const [seconds, setSeconds] = useState(1);
    const [error, setError] = useState('');

    const submit = async (e) => {
        const result = await onSubmit(subject, seconds);
        if (result.error) {
            setError(result.error);
        }
    }
    const validateSeconds = (value)=>{
        if( value > 59 || value < 1 ){
            setError('Must be a number between 1 - 59')
            setSeconds();
        }
        else{
            setSeconds(value);
            setError('')
        }
    }
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Add job
            </Typography>
            <div style={{marginBottom: '22px'}}>
                {!!error && <Alert severity="warning">{error}</Alert>}
            </div>
            <form onSubmit={submit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            size="small"
                            name="subject"
                            label="Subject"
                            variant="outlined"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{width: '170px'}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            size="small"
                            name="seconds"
                            label="Seconds"
                            variant="outlined"
                            value={seconds}
                            onChange={(e) => validateSeconds(e.target.value)}
                            style={{width: '170px'}}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>

    );
}