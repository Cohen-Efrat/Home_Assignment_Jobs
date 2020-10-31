import React, {useState, useEffect} from "react";
import {
    Container,
    GridList,
    GridListTile,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Modal,
    GridListTileBar
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useAuth} from "../context/auth-context"
import httpAgent from "../util/httpAgent";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Jobs from "./Jobs";
import AddJobForm from "./AddJobForm";

import socket from "../util/socket";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        margin: 40
    },
    gridList: {
        width: 800,
        height: 600,
    },
    appBar: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textTransform: 'capitalize'
    },
    modal: {
        position: 'absolute',
        width: 500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '20%',
        left: '35%'
    },
    tileBar: {
        height: 38,
        textTransform: 'capitalize'
    },
    addJob:{
        margin: 22,
        border: '2px solid #000',
        padding: 20,
    }
}));

const createTiles = (jobs) => {
    const gifs = [];
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        for (let j = 0; j < job.gifs.length; j++) {
            const gif = job.gifs[j]
            gifs.push({
                img: gif,
                title: job.subject,
                key: `${i}${j}`
            })
        }
    }
    return gifs
}

export default function Main() {
    const classes = useStyles();
    const {setAuthData, authData} = useAuth();
    const [tileData, setTileData] = useState([]);
    const [openList, setOpenList] = useState(false);

    const logOut = async () => {
        await httpAgent.post('/users/logout', {}, {Authorization: `Bearer ${authData.token}`});
        setAuthData('')
    };
    const getData = async () => {
        const response = await httpAgent.get(`/jobs`, {},
            {Authorization: `Bearer ${authData.token}`});
        const data = createTiles(response)
        setTileData(data)
    };
    useEffect(() => {
        getData();
        socket.emit("join", {user: authData.user});
    }, []);

    useEffect(() => {
        const handleNewGif = (url, subject) => {
            const result = tileData.find((tile) => tile.img === url);
            if (!result) {
                setTileData([...tileData, {
                    img: url,
                    title: subject,
                    key: url
                }])
            }
        }
        const onNewGif = ({url, subject}) => handleNewGif(url, subject);
        socket.on("newGif", onNewGif);
        return () => socket.off("newGif", onNewGif);
    }, [tileData]);

    const handleOpenList = () => {
        setOpenList(true);
    };
    const handleCloseList = () => {
        setOpenList(false);
    };

    const removeJob = async (id) => {
        await httpAgent.del(`/jobs/${id}`, {},
            {Authorization: `Bearer ${authData.token}`});
        getData()
        handleCloseList();
    }
    const createJob = async (subject, frequency) => {
        const response = await httpAgent.post(`/jobs/`, {
                subject,
                frequency: parseInt(frequency),
            },
            {Authorization: `Bearer ${authData.token}`});
        socket.emit("addJob", {
            subject: response.subject,
            seconds: response.frequency,
            jobId: response._id,
            userId: authData.user._id
        });
        return response
    }

    return (
        <React.Fragment>
            <Container fixed>
                <div className={classes.appBar}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                {authData.user.name} Gallery
                            </Typography>
                            <Button onClick={handleOpenList}>
                                <ListAltIcon/>
                            </Button>
                            <Button onClick={logOut}>
                                <ExitToAppIcon/>
                            </Button>

                        </Toolbar>
                    </AppBar>
                </div>
                <div className={classes.addJob}>
                    <AddJobForm onSubmit={createJob}/>
                </div>
                <div className={classes.root}>
                    <GridList cellHeight={160} className={classes.gridList} cols={5}>
                        {tileData.map((tile) => (
                            <GridListTile key={tile.key} cols={tile.cols || 1}>
                                <img src={tile.img} alt={tile.title}/>
                                <GridListTileBar className={classes.tileBar}
                                                 title={tile.title}
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                <Modal
                    open={openList}
                    onClose={handleCloseList}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className={classes.modal}>
                        <Jobs onDelete={removeJob}/>
                    </div>
                </Modal>
            </Container>
        </React.Fragment>
    );
}