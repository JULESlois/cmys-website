// src/data/life/events-parametric.ts
import type { ParametricEvent } from "../../engine/types";
import {
  CHILDHOOD_LETHAL_EVENTS,
  CHILDHOOD_PARAMETRIC_EVENTS,
  CHILDHOOD_PHYSIQUE_EVENTS,
  INFANT_PARAMETRIC_EVENTS,
} from "./parametric-events/childhood";
import {
  LOVE_PARAMETRIC_EVENTS,
  YOUTH_LETHAL_EVENTS,
  YOUTH_PARAMETRIC_EVENTS,
} from "./parametric-events/youth";
import {
  MIDLIFE_LETHAL_EVENTS,
  MIDLIFE_PARAMETRIC_EVENTS,
} from "./parametric-events/midlife";
import {
  ELDER_LETHAL_EVENTS,
  ELDER_PARAMETRIC_EVENTS,
} from "./parametric-events/elder";
import { RELATIONSHIP_PARAMETRIC_EVENTS } from "./parametric-events/relationships";
import { WEALTH_PARAMETRIC_EVENTS } from "./parametric-events/wealth";
import { LUCK_PARAMETRIC_EVENTS } from "./parametric-events/luck";
import { CAREER_PARAMETRIC_EVENTS } from "./parametric-events/career";
import { MEME_PARAMETRIC_EVENTS } from "./parametric-events/meme";

export const PARAMETRIC_EVENTS: ParametricEvent[] = [
  ...INFANT_PARAMETRIC_EVENTS,
  ...CHILDHOOD_PARAMETRIC_EVENTS,
  ...YOUTH_PARAMETRIC_EVENTS,
  ...MIDLIFE_PARAMETRIC_EVENTS,
  ...ELDER_PARAMETRIC_EVENTS,
  ...CHILDHOOD_LETHAL_EVENTS,
  ...YOUTH_LETHAL_EVENTS,
  ...MIDLIFE_LETHAL_EVENTS,
  ...ELDER_LETHAL_EVENTS,
  ...RELATIONSHIP_PARAMETRIC_EVENTS,
  ...WEALTH_PARAMETRIC_EVENTS,
  ...LUCK_PARAMETRIC_EVENTS,
  ...LOVE_PARAMETRIC_EVENTS,
  ...CHILDHOOD_PHYSIQUE_EVENTS,
  ...CAREER_PARAMETRIC_EVENTS,
  ...MEME_PARAMETRIC_EVENTS,
];
