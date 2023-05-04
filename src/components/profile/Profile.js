import { Stack } from "@mui/material";
import MatchHistory from "./matchHistory/MatchHistory";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserV1 } from "../../api/LeagueApi";
import SummonerBanner from "./profileBanner/SummonerBanner";
import Box from "@mui/material/Box";

const Profile = () => {
    const { summonerName, region } = useParams();
    const [summonerData, setSummonerData] = useState(null);
    useEffect(() => {
        setSummonerData(null);
        const fetchSummonerData = async () => {
            const summonerResponse = await getUserV1(summonerName, region);
            if (summonerResponse.status === 200 && summonerResponse) {
                setSummonerData(summonerResponse.data);
            }
        };
        fetchSummonerData();
    }, [summonerName, region]);
    return (
        <>
            {summonerData && (
                <Box
                    sx={{
                        margin: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                    }}
                    width={{
                        xs: "100%",
                        sm: "800px",
                        md: "100%",
                        lg: "1150px",
                    }}
                >
                    <SummonerBanner
                        summonerData={summonerData}
                        region={region}
                    />
                    <Stack
                        spacing={3}
                        direction={{
                            xs: "column",
                            sm: "column",
                            md: "column",
                            lg: "row",
                        }}
                        justifyContent={{
                            xs: "center",
                            sm: "center",
                            md: "center",
                            lg: "flex-start",
                        }}
                        alignItems={{
                            xs: "center",
                            sm: "center",
                            md: "center",
                            lg: "flex-start",
                        }}
                        width={"100%"}
                    >
                        <MatchHistory
                            summonerData={summonerData}
                            region={region}
                        />
                    </Stack>
                </Box>
            )}
        </>
    );
};
export default Profile;