import type { GameState } from "../../engine/types";

export interface LifeMusicReference {
  platform: "netease";
  songId: number;
  title: string;
  englishTitle: string;
  artist: string;
  album: string;
  url: string;
  note: string;
}

export interface LifeMusicTrack {
  id: string;
  title: string;
  artist?: string;
  path: string;
  volume?: number;
  loop?: boolean;
  reference?: LifeMusicReference;
}

export type LifeMusicMode = "local" | "netease_outer_url";

/**
 * /life BGM playback mode.
 * - local: play files under /public/musics/life
 * - netease_outer_url: test mode, play NetEase outer audio URLs by song id
 */
export const LIFE_MUSIC_MODE: LifeMusicMode = "netease_outer_url";

export function getNeteaseOuterAudioUrl(songId: number): string {
  return `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
}

function neteaseReference(
  songId: number,
  title: string,
  englishTitle: string,
  artist: string,
  album: string,
  note: string,
): LifeMusicReference {
  return {
    platform: "netease",
    songId,
    title,
    englishTitle,
    artist,
    album,
    url: `https://music.163.com/#/song?id=${songId}`,
    note,
  };
}

export const LIFE_MUSIC_PLAYLIST: LifeMusicTrack[] = [
  {
    id: "life_menu",
    title: "沉默开局",
    path: "/musics/life/life-menu.mp3",
    volume: 0.42,
    loop: true,
    reference: neteaseReference(22706979, "汐", "Shio", "VISUAL ARTS / Key", "CLANNAD ORIGINAL SOUNDTRACK", "极简、清冷、带有记忆回流感，适合选天赋与开局等待。"),
  },
  {
    id: "arc_infant",
    title: "初梦幼生",
    path: "/musics/life/arc-infant.mp3",
    volume: 0.38,
    loop: true,
    reference: neteaseReference(22706987, "東風", "Spring Wind", "折戸伸治", "CLANNAD ORIGINAL SOUNDTRACK", "温暖、轻快、生活感强，适合幼年早期的安全感。"),
  },
  {
    id: "arc_elementary",
    title: "春苗幼生",
    path: "/musics/life/arc-elementary.mp3",
    volume: 0.4,
    loop: true,
    reference: neteaseReference(26085650, "夏影", "Summer Lights", "Lia", "Key+Lia Natukage / nostalgia", "夏日、童年、远方感明显，适合小学篇的乡路与玩伴。"),
  },
  {
    id: "arc_middle_school",
    title: "沉默应试",
    path: "/musics/life/arc-middle-school.mp3",
    volume: 0.42,
    loop: true,
    reference: neteaseReference(22706980, "渚", "Nagisa", "VISUAL ARTS / Key", "CLANNAD ORIGINAL SOUNDTRACK", "旋律温柔但带一点脆弱，适合中学篇的沉默、友情和压力。"),
  },
  {
    id: "arc_university",
    title: "出门远涉",
    path: "/musics/life/arc-university.mp3",
    volume: 0.44,
    loop: true,
    reference: neteaseReference(22706973, "同じ高みへ", "To the Same Heights", "水月陵 / VISUAL ARTS / Key", "CLANNAD / Tomoyo After Piano Arrange Album ピアノの森", "有前行感和青春抬头感，适合大学篇的离家与自我扩张。"),
  },
  {
    id: "arc_young_adult",
    title: "城暮游生",
    path: "/musics/life/arc-young-adult.mp3",
    volume: 0.45,
    loop: true,
    reference: neteaseReference(22707008, "潮鳴り", "Roaring Tides", "折戸伸治", "CLANNAD ORIGINAL SOUNDTRACK", "压抑、潮湿、漂泊感强，适合青年篇的城市和孤独。"),
  },
  {
    id: "arc_midlife",
    title: "承命应世",
    path: "/musics/life/arc-midlife.mp3",
    volume: 0.44,
    loop: true,
    reference: neteaseReference(22707016, "遙かな年月 (piano)", "Distant Years -Piano-", "麻枝准", "CLANNAD ORIGINAL SOUNDTRACK", "时间跨度和责任感明显，适合壮年篇的家庭、事业和代价。"),
  },
  {
    id: "arc_elder",
    title: "迟暮影深",
    path: "/musics/life/arc-elder.mp3",
    volume: 0.4,
    loop: true,
    reference: neteaseReference(22706993, "雪野原", "Snowfield", "折戸伸治", "CLANNAD ORIGINAL SOUNDTRACK", "安静、稀薄、像回望白色荒原，适合晚年篇。"),
  },
  {
    id: "chapter_well",
    title: "沉没异生",
    path: "/musics/life/chapter-well.mp3",
    volume: 0.5,
    loop: true,
    reference: neteaseReference(760555, "少女の幻想 (ZTS Remix)", "The Girl’s Fantasy -ZTS Remix-", "riya / Haruka Shimotsuki / takumaru", "メグメル/だんご大家族", "梦境感、非现实感强，适合井下与平行人生的错位。"),
  },
  {
    id: "chapter_yomi",
    title: "沉命余赊",
    path: "/musics/life/chapter-yomi.mp3",
    volume: 0.5,
    loop: true,
    reference: neteaseReference(22706998, "無間", "Mugen", "折戸伸治", "CLANNAD ORIGINAL SOUNDTRACK", "阴冷、循环、压迫感强，适合黄泉债与延期死亡。"),
  },
  {
    id: "event_danger",
    title: "危境临身",
    path: "/musics/life/event-danger.mp3",
    volume: 0.52,
    loop: true,
    reference: neteaseReference(761001, "灰燼に帰す", "Return to Ashes", "VISUAL ARTS / Key", "CLANNAD remix album -memento-", "紧张、坠落、燃尽感明显，适合事故、暴力和高风险选项。"),
  },
  {
    id: "event_illness",
    title: "沉疴压身",
    path: "/musics/life/event-illness.mp3",
    volume: 0.46,
    loop: true,
    reference: neteaseReference(22706999, "潮鳴りII", "Roaring Tides II", "折戸伸治", "CLANNAD ORIGINAL SOUNDTRACK", "比潮鳴り更沉，适合疾病、衰弱和身体透支事件。"),
  },
  {
    id: "death",
    title: "沉暮余声",
    path: "/musics/life/death.mp3",
    volume: 0.48,
    loop: true,
    reference: neteaseReference(22707017, "存在 -Piano-", "Existence -Piano-", "戸越まごめ", "CLANNAD ORIGINAL SOUNDTRACK", "克制、空旷、留下余震，适合死亡页而不显得煽情。"),
  },
  {
    id: "ending",
    title: "此梦已收",
    path: "/musics/life/ending.mp3",
    volume: 0.46,
    loop: true,
    reference: neteaseReference(22707003, "空に光る", "Shining in the Sky", "戸越まごめ", "CLANNAD ORIGINAL SOUNDTRACK", "有终章感和回光感，适合结局总结。"),
  },
];


export function getLifeMusicPlaylist(mode: LifeMusicMode = LIFE_MUSIC_MODE): LifeMusicTrack[] {
  if (mode === "local") return LIFE_MUSIC_PLAYLIST;

  return LIFE_MUSIC_PLAYLIST.map((track) => {
    if (!track.reference?.songId) return track;
    return {
      ...track,
      title: `${track.reference.title} (${track.reference.englishTitle})`,
      artist: track.reference.artist,
      path: getNeteaseOuterAudioUrl(track.reference.songId),
    };
  });
}

export function selectLifeMusicId(state: GameState): string {
  if (state.phase.type === "dying") return "death";
  if (state.phase.type === "result" && state.deathRecord) return "death";
  if (state.phase.type === "ending_prelude") return "ending";
  if (state.phase.type === "result" && state.attributeEndingId) return "ending";
  if (state.phase.type === "talent_selection" || state.phase.type === "save_choice") return "life_menu";

  if (state.phase.type === "chapter_intro") {
    if (state.phase.chapterId === "well_otherworld") return "chapter_well";
    if (state.phase.chapterId === "yomi_debt") return "chapter_yomi";
  }

  if (state.chapter.activeChapterId === "well_otherworld") return "chapter_well";
  if (state.chapter.activeChapterId === "yomi_debt") return "chapter_yomi";

  return state.chapter.currentArcId || "life_menu";
}
