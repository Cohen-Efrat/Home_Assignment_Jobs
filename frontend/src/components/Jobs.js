import React, {useState, useEffect} from 'react';
import {
    Paper,
    TableContainer,
    TableHead,
    Table,
    Button,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    TextField,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import httpAgent from "../util/httpAgent";
import {useAuth} from "../context/auth-context"
import DeleteIcon from '@material-ui/icons/Delete';

const columns = [
    {id: 'subject', label: 'Subject', minWidth: 120},
    {id: 'frequency', label: 'Seconds', minWidth: 100},
    {id: 'actions', label: 'Delete', minWidth: 100,},
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        heigt: '100%'
    },
    container: {
        maxHeight: 700,
    },
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '35%',
        left: '35%'
    }
}));

export default function Jobs({onDelete}) {
    const classes = useStyles();
    const {authData} = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState('');
    const [jobs, setJobs] = useState([]);

    const getData = async () => {
        const response = await httpAgent.get('/jobs', {},
            {Authorization: `Bearer ${authData.token}`});
        setRows(response);
        setJobs(response)
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const search = (value) => {
        setQuery(value)
        const filterdData = jobs.filter((row) => {
            if (row.subject.toLowerCase().includes(value)) {
                return row
            }
        })
        setRows(filterdData)
    }
    const removeJob = async (id) => {
        await onDelete(id);
    }
    return (
        <div>
            <Paper className={classes.root}>
                <Typography variant="h6">
                    Jobs
                </Typography>
                <div>
                    <TextField
                        name="search"
                        size="small"
                        label="Search"
                        variant="outlined"
                        value={query}
                        onChange={(e) => search(e.target.value)}
                        style={{width: '170px'}}
                    />
                </div>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{minWidth: column.minWidth}}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                        <TableCell align="left">{row.subject}</TableCell>
                                        <TableCell align="left">{row.frequency}</TableCell>
                                        <TableCell align="left">
                                            <Button onClick={()=>removeJob(row._id)}>
                                                <DeleteIcon/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>

        </div>
    );
}