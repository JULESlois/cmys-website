# /life BGM playlist

`src/data/life/music.ts` supports two playback modes:

- `local`: play licensed or self-made files under `public/musics/life/`.
- `netease_outer_url`: test mode, play NetEase Cloud Music outer audio URLs such as `https://music.163.com/song/media/outer/url?id=22706979.mp3`.

Current mode is configured by `LIFE_MUSIC_MODE` in `src/data/life/music.ts`.

## Local filenames

Add actual licensed or self-made audio files with the same names when using `local` mode:

- life-menu.mp3 — 汐 (Shio) / VISUAL ARTS / Key / NetEase song 22706979
- arc-infant.mp3 — 東風 (Spring Wind) / 折戸伸治 / NetEase song 22706987
- arc-elementary.mp3 — 夏影 (Summer Lights) / Lia / NetEase song 26085650
- arc-middle-school.mp3 — 渚 (Nagisa) / VISUAL ARTS / Key / NetEase song 22706980
- arc-university.mp3 — 同じ高みへ (To the Same Heights) / 水月陵, VISUAL ARTS / Key / NetEase song 22706973
- arc-young-adult.mp3 — 潮鳴り (Roaring Tides) / 折戸伸治 / NetEase song 22707008
- arc-midlife.mp3 — 遙かな年月 (piano) (Distant Years -Piano-) / 麻枝准 / NetEase song 22707016
- arc-elder.mp3 — 雪野原 (Snowfield) / 折戸伸治 / NetEase song 22706993
- chapter-well.mp3 — 少女の幻想 (ZTS Remix) (The Girl’s Fantasy -ZTS Remix-) / NetEase song 760555
- chapter-yomi.mp3 — 無間 (Mugen) / 折戸伸治 / NetEase song 22706998
- event-danger.mp3 — 灰燼に帰す (Return to Ashes) / VISUAL ARTS / Key / NetEase song 761001
- event-illness.mp3 — 潮鳴りII (Roaring Tides II) / 折戸伸治 / NetEase song 22706999
- death.mp3 — 存在 -Piano- (Existence -Piano-) / 戸越まごめ / NetEase song 22707017
- ending.mp3 — 空に光る (Shining in the Sky) / 戸越まごめ / NetEase song 22707003

Do not add third-party audio files to the repository unless you have permission to use and redistribute them.
