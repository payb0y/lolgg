import { Runes } from "../../store/Runes.js";
import { Stack } from "@mui/material";
import Rune from "../parts/Rune.js";
const MatchRunes = ({ perks, width, height }) => {
    const primaryStyle = perks.styles[0].style;
    const secondaryStyle = perks.styles[1].style;
    const primaryPerk = perks.styles[0].selections[0].perk;
    const secondaryPerk = perks.styles[1].selections[0].perk;
    const primaryStyleName = Runes.find((rune) => rune.id === primaryStyle);
    const secondaryStyleName = Runes.find((rune) => rune.id === secondaryStyle);

    const primaryPerkName = primaryStyleName.slots
        .map((slot) => {
            return slot.runes.find((rune) => rune.id === primaryPerk);
        })
        .filter((rune) => rune !== undefined);
    const secondaryPerkName = secondaryStyleName.slots
        .map((slot) => {
            return slot.runes.find((rune) => rune.id === secondaryPerk);
        })
        .filter((rune) => rune !== undefined);
    return (
        <Stack spacing={0.2}>
            <Rune rune={primaryPerkName[0]} width={width} height={height} />
            <Rune rune={secondaryPerkName[0]} width={width} height={height} />
        </Stack>
    );
};

export default MatchRunes;