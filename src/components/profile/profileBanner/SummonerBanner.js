import React from "react";
import ProfileIcon from "./ProfileIcon";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import champions from "../../../data/champions.json";
import CustomPaper from "../../UI/CustomPaper";
import Stack from "@mui/material/Stack";
import LiveMatch from "../liveMatch/LiveMatch";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import SummonerRank from "./SummonerRank";
import SummonerPastRanks from "./SummonerPastRanks";
import ProfileUpdate from "./ProfileUpdate";

const SummonerBanner = ({ summonerData, region }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const HandleLive = () => {
    setLiveMatchVisible(true);
  };
  const [mainChampion, setMainChampion] = useState(null);
  const [liveMatchVisible, setLiveMatchVisible] = useState(false);

  useEffect(() => {
    const champion =
      champions.keys[summonerData.championMasteries[0].championId];
    const skin =
      champions.data[champion].skins[
        Math.floor(Math.random() * champions.data[champion].skins.length)
      ];
    setMainChampion({ champion: champion, skin: skin.num });
  }, [summonerData.championMasteries]);
  return (
    <>
      {liveMatchVisible && (
        <LiveMatch
          setLiveMatchVisible={setLiveMatchVisible}
          region={region}
          summonerData={summonerData}
        />
      )}
      {mainChampion && (
        <Box
          id="main-image"
          minWidth={"100%"}
          sx={{
            height: isMobile ? "fit-content" : "100%",
            backgroundImage: isMobile
              ? `url(https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${mainChampion.champion}_${mainChampion.skin}.jpg)`
              : `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mainChampion.champion}_${mainChampion.skin}.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "start",
            padding: "10px",
          }}
        >
          <Stack
            alignItems={{
              xs: "center",
              sm: "flex-start",
              md: "flex-start",
              lg: "flex-start",
            }}
            height="100%"
            justifyContent={"flex-start"}
            spacing={1}
          >
            <SummonerPastRanks summonerData={summonerData} />
            <CustomPaper
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                gap: "5px",
              }}
            >
              <ProfileUpdate summonerData={summonerData} />
              <ProfileIcon summoner={summonerData} width={150} height={150} />
              <Stack
                spacing={0.5}
                alignItems="center"
                sx={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  padding: "4px 12px",
                  borderRadius: "4px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  {summonerData.gameName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.9rem",
                  }}
                >
                  #{summonerData.tagLine}
                </Typography>
              </Stack>
              <Button variant="outlined" onClick={HandleLive}>
                Live Match
              </Button>
            </CustomPaper>
            <SummonerRank summonerData={summonerData} />
          </Stack>
        </Box>
      )}
    </>
  );
};

export default SummonerBanner;
