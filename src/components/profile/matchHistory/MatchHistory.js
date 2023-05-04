import { useEffect } from "react";
import Match from "./match/Match";
import { getMatchHistoryV1, getMatchDetailsV1 } from "../../../api/LeagueApi";
import { useState } from "react";
import { Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RecentAllies from "../stats/RecentAllies";
import Performance from "../stats/Performance";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import LinearProgress from "@mui/material/LinearProgress";

const MatchHistory = ({ summonerData, region }) => {
    const [matchHistory, setMatchHistory] = useState([]);
    const [alert, setAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [start, setStart] = useState(0);
    useEffect(() => {
        const fetchMatchHistory = async () => {
            const type = "All";
            setIsLoading(true);
            const matchHistoryResponse = await getMatchHistoryV1(
                summonerData.puuid,
                start,
                region,
                type
            );
            if (matchHistoryResponse.data.length < 10) {
                setAlert(true);
            }
            const matchIds = await Promise.all(
                matchHistoryResponse.data.map((matchId) => matchId)
            );
            const matchDetailsResponses = await Promise.all(
                matchIds.map((matchId) =>
                    getMatchDetailsV1(matchId, region).then(
                        (response) => response.data
                    )
                )

                // matchIds.map(
                //     (matchId) =>
                //         new Promise((resolve) =>
                //             setTimeout(
                //                 () =>
                //                     resolve(
                //                         getMatchDetailsV1(matchId, region).then(
                //                             (response) => response.data
                //                         )
                //                     ),
                //                 500
                //             )
                //         )
                // )
            );
            setMatchHistory((pre) => [...pre, ...matchDetailsResponses]);
            setIsLoading(false);
        };

        fetchMatchHistory();
    }, [summonerData.puuid, start, region]);
    const handleClick = () => {
        setStart(start + 10);
    };

    return (
        <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            alignItems={{
                xs: "center",
                md: "center",
                lg: "flex-start",
            }}
            width={"100%"}
            justifyContent={"space-between"}
            spacing={1}
        >
            <Stack
                spacing={1}
                direction={{
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "column",
                }}
            >
                <RecentAllies
                    matchHistory={matchHistory}
                    summonerData={summonerData}
                />
                <Performance
                    matchHistory={matchHistory}
                    summonerData={summonerData}
                />
            </Stack>
            {matchHistory.length === 0 ? (
                <Box sx={{ width: "100%" }}>
                    <LinearProgress color="inherit" />
                </Box>
            ) : (
                <Stack spacing={1}>
                    <Stack spacing={1}>
                        {matchHistory.map((match, index) => (
                            <Match
                                match={match}
                                key={index}
                                summonerData={summonerData}
                            />
                        ))}
                    </Stack>

                    {alert ? (
                        <Alert variant="outlined" severity="info">
                            No (more) matches found.
                        </Alert>
                    ) : (
                        <LoadingButton
                            loading={isLoading}
                            variant="outlined"
                            onClick={handleClick}
                            style={{
                                marginBottom: "20px",
                            }}
                        >
                            More
                        </LoadingButton>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

export default MatchHistory;