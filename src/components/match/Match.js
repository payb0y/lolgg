import React, { useContext, useState } from "react";
import { SummonerContext } from "../../store/SummonerContext";
import MatchInfo from "./MatchInfo";
import MatchKda from "./MatchKda";
import MatchChampion from "./MatchChampion";
import MatchItems from "./MatchItems";
import MatchParticipants from "./MatchParticipants";
import MatchKills from "./MatchKills";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import MatchMinions from "./MatchMinions";
import MatchStats from "../matchStats/MatchStats";
import MatchSpells from "./MatchSpells";
import MatchRunes from "./MatchRunes";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
const Match = (props) => {
    const { summonerData } = useContext(SummonerContext);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const match = props.value;
    const participantData = match.info.participants.find(
        (participant) => participant.summonerName === summonerData.name
    );
    const handleDetailsClick = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };
    return (
        <Box
            sx={{
                backgroundColor: participantData.win
                    ? "rgba(83, 131, 232, 0.9)"
                    : "rgba(232, 64, 87, 0.9)",
                borderRadius: 1,
                p: 1,
                m: 1,
            }}
        >
            <Stack
                justifyContent="flex-start"
                alignItems="center"
                direction="row"
                spacing={4}
            >
                <MatchInfo match={match} />
                <Stack>
                    <Stack direction="row" spacing={2}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                        >
                            <MatchChampion
                                participant={participantData}
                                height={50}
                                width={50}
                            />
                            <MatchSpells
                                participant={participantData}
                                width={30}
                                height={30}
                            />
                            <MatchRunes
                                perks={participantData.perks}
                                width={30}
                                height={30}
                            />
                        </Stack>
                        <MatchKda participant={participantData} />
                        <MatchMinions participant={participantData} />
                    </Stack>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <MatchItems
                            participant={participantData}
                            width={30}
                            height={30}
                        />
                        <MatchKills participant={participantData} />
                    </Stack>
                </Stack>
                <MatchParticipants match={match} summoner={participantData} />
                <div
                    onClick={handleDetailsClick}
                    className="expand-div"
                    title="Details"
                >
                    {isDetailsOpen ? (
                        <ArrowDropUpIcon />
                    ) : (
                        <ArrowDropDownIcon />
                    )}
                </div>
            </Stack>
            {isDetailsOpen && (
                <MatchStats match={match} summoner={participantData} />
            )}
        </Box>
    );
};

export default Match;
