import { getUserV1 } from "../../api/LeagueApi";
export const getGameType = (queueId) => {
    switch (queueId) {
        case 450:
            return "ARAM";
        case 420:
            return "Ranked Solo";
        case 400:
            return "Normal";
        case 900:
            return "URF";
        case 700:
            return "Clash";
        case 440:
            return "Ranked Flex";
        case 430:
            return "Blind Pick";
        default:
            return "Unknown";
    }
};
export const getGameDate = (gameEndTimestamp) => {
    const a = Math.floor((Date.now() - gameEndTimestamp) / 86400000);
    if (a === 0) {
        if (
            Math.floor((Date.now() - gameEndTimestamp) / 60000).toString() > 60
        ) {
            return (
                Math.floor(
                    (Date.now() - gameEndTimestamp) / 3600000
                ).toString() + " hours ago"
            );
        } else {
            return (
                Math.floor((Date.now() - gameEndTimestamp) / 60000).toString() +
                " minutes ago"
            );
        }
    } else if (a < 1) {
        return (
            Math.floor((Date.now() - gameEndTimestamp) / 3600000).toString() +
            " hours ago"
        );
    } else {
        return a + " days ago";
    }
};
export const getSummonerIcon = async (summonerName) => {
    return await getUserV1(summonerName, "EUW").then((res) => {
        return res.data.profileIconId;
    });
};

export const getRecentlyPlayedWith = async (matchHistory, summonerData) => {
    let allies = [];
    matchHistory.forEach((match) => {
        const me = match.info.participants.filter(
            (participant) => participant.summonerId === summonerData.id
        );
        const f = match.info.participants.filter(
            (participant) =>
                participant.teamId === me[0].teamId &&
                participant.summonerId !== summonerData.id
        );
        f.forEach((a) => {
            if (
                !allies.find(
                    (ally) => ally.name === a.summonerName.toLowerCase()
                )
            ) {
                allies.push({
                    name: a.summonerName.toLowerCase(),
                    wins: a.win ? 1 : 0,
                    gamesPlayed: 1,
                    id: a.summonerId,
                    icon: null,
                });
            } else {
                allies = allies.map((ally) =>
                    ally.name === a.summonerName.toLowerCase()
                        ? {
                              ...ally,
                              wins: a.win + ally.wins,
                              gamesPlayed: ally.gamesPlayed + 1,
                          }
                        : ally
                );
            }
        });
    });
    const filteredAllies = allies
        .filter((ally) => ally.gamesPlayed > 1)
        .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
        .slice(0, 10);

    const promises = filteredAllies.map((ally) => getSummonerIcon(ally.name));
    const icons = await Promise.all(promises);
    filteredAllies.forEach((ally, index) => {
        ally.icon = icons[index];
    });

    return filteredAllies;
};

export const getPerformance = (matchHistory, summonerData) => {
    let champions = [];
    matchHistory.forEach((match) => {
        match.info.participants.forEach((participant) => {
            if (participant.summonerId === summonerData.id) {
                if (
                    !champions.find(
                        (champion) => champion.name === participant.championName
                    )
                ) {
                    champions.push({
                        name: participant.championName,
                        wins: participant.win ? 1 : 0,
                        losses: !participant.win ? 1 : 0,
                        kills: participant.kills,
                        deaths: participant.deaths,
                        assists: participant.assists,
                        winRate: participant.win ? 100 : 0,
                        gamesPlayed: 1,
                    });
                } else {
                    champions = champions.map((champion) =>
                        champion.name === participant.championName
                            ? {
                                  ...champion,
                                  wins: champion.wins + participant.win,
                                  losses: champion.losses + !participant.win,
                                  kills: champion.kills + participant.kills,
                                  deaths: champion.deaths + participant.deaths,
                                  assists:
                                      champion.assists + participant.assists,
                                  gamesPlayed: champion.gamesPlayed + 1,
                              }
                            : champion
                    );
                }
            }
        });
    });
    const v1 = champions
        .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
        .slice(0, 10);
    return v1;
};