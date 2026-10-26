export const examples = [
  {
    "id": "qwen36-35b-a3b-s_4e_deadpoolwolverine_c8-rep03-grpo",
    "title": "Deadpool & Wolverine",
    "model": "Qwen3.6-35B-A3B",
    "method": "Outcome-only GRPO",
    "task": "s_4e_deadpoolwolverine_c8",
    "rep": 3,
    "focus": "Clearer speech and stronger musical hits",
    "observed": "Compare the spoken line and the music entry before the storm shot. Both recorded judges favor the trained dialogue and music.",
    "caveat": "The first word is slightly clipped, the music entry is abrupt, and a brief unrelated frame flash remains near join 3.",
    "size": "35B",
    "number": "01",
    "before": {
      "video": "assets/media/example-01-before.mp4",
      "poster": "assets/media/example-01-before.jpg",
      "score": 0.448,
      "invalid": false,
      "duration": 7.125,
      "sha256": "92ebd11fbb8aa71f4d6bb3b10cb0b13f4eea277267f98dfbaaeb8e2d5d7bf0bf"
    },
    "after": {
      "video": "assets/media/example-01-after.mp4",
      "poster": "assets/media/example-01-after.jpg",
      "score": 0.783,
      "invalid": false,
      "duration": 7.049,
      "sha256": "39931bc5cc28a3926c429fed8bc3084bbf7a4a43a01545cd981493f40aec171f"
    }
  },
  {
    "id": "qwen35-9b-s_4e_deadpoolwolverine_c8-rep04-prm-decayed",
    "title": "Deadpool & Wolverine",
    "model": "Qwen3.5-9B",
    "method": "GRPO+PRM (decayed \u03bb)",
    "task": "s_4e_deadpoolwolverine_c8",
    "rep": 4,
    "focus": "From a silent render to an audible edit",
    "observed": "The untrained output has no audio track. The trained output contains audio. The recorded blind judge rates music and transition execution 0/4 \u2192 4/4. Both judges still report dialogue masked by music in the trained clip.",
    "caveat": "Same task and evaluation repetition. This inventory includes higher, lower and equal scores, as well as rejected submissions. It is not an estimate of average training effects.",
    "size": "9B",
    "number": "02",
    "before": {
      "video": "assets/media/example-02-before.mp4",
      "poster": "assets/media/example-02-before.jpg",
      "score": 0.043,
      "invalid": false,
      "duration": 7.333333,
      "sha256": "6eeddfb5390e1e39e6d35f6f5f50857d3358de82eb802caa96ac961404359795"
    },
    "after": {
      "video": "assets/media/example-02-after.mp4",
      "poster": "assets/media/example-02-after.jpg",
      "score": 0.764,
      "invalid": false,
      "duration": 7.0,
      "sha256": "f08a753f0ecc1e65171daf301c15ac865745443e07225b608617dffed67f2cc3"
    }
  },
  {
    "id": "qwen35-9b-s_4e_whiplash_c13-rep02-grpo",
    "title": "Whiplash",
    "model": "Qwen3.5-9B",
    "method": "Outcome-only GRPO",
    "task": "s_4e_whiplash_c13",
    "rep": 2,
    "focus": "Audio and title-card recovery",
    "observed": "The base audio stream ends after 0.49 seconds. GRPO delivers audio across the sequence, and the recorded reference judge rates title-card integration and continuity higher.",
    "caveat": "The task requires cards at p06, p08 and p10 but leaves their wording and design to the editor. Declared dialogue remains inaudible. Music judgments conflict: some praise the drum-led montage while others say the required music bed is absent.",
    "size": "9B",
    "number": "03",
    "before": {
      "video": "assets/media/example-03-before.mp4",
      "poster": "assets/media/example-03-before.jpg",
      "score": 0.284,
      "invalid": false,
      "duration": 6.25,
      "sha256": "773e8f82dfe4d11906c8f9e436ba2d4d75e156c424cdf139de4c7dcc90d7c746"
    },
    "after": {
      "video": "assets/media/example-03-after.mp4",
      "poster": "assets/media/example-03-after.jpg",
      "score": 0.573,
      "invalid": false,
      "duration": 6.214,
      "sha256": "dfe695973adad24a95e77302cca8178be97b4a0e752718623994fcedad9cd67b"
    }
  },
  {
    "id": "qwen35-9b-s_4e_whiplash_c13-rep01-prm-decayed",
    "title": "Whiplash",
    "model": "Qwen3.5-9B",
    "method": "GRPO+PRM (decayed \u03bb)",
    "task": "s_4e_whiplash_c13",
    "rep": 1,
    "focus": "The picture now runs through the montage",
    "observed": "The base file's video streams end after 0.917 seconds while its audio continues. The trained output supplies a roughly 6.29-second picture sequence; the blind judge also rates its drum-led transitions higher.",
    "caveat": "This is rendering-completion recovery, not a comparison of two intact edits. Required-music ratings remain low, declared dialogue is inaudible, and the reference continuity judge still rates the trained sequence 0.",
    "size": "9B",
    "number": "04",
    "before": {
      "video": "assets/media/example-04-before.mp4",
      "poster": "assets/media/example-04-before.jpg",
      "score": 0.117,
      "invalid": false,
      "duration": 6.214,
      "sha256": "dfc334d4c35580a06605246a4ae2205a894eb2ecb58112d1237e5aa05763dd74"
    },
    "after": {
      "video": "assets/media/example-04-after.mp4",
      "poster": "assets/media/example-04-after.jpg",
      "score": 0.504,
      "invalid": false,
      "duration": 6.291667,
      "sha256": "93a326bcd62a193c4848b0991c303dbf5ee5e310fa2dac7d9676b47a5b68bb45"
    }
  },
  {
    "id": "qwen35-9b-s_4e_sinners_c2-rep03-prm-decayed",
    "title": "Sinners",
    "model": "Qwen3.5-9B",
    "method": "GRPO+PRM (decayed \u03bb)",
    "task": "s_4e_sinners_c2",
    "rep": 3,
    "focus": "Valid submission with coherent voiceover bridges",
    "observed": "The base score of 0 comes from an invalid sound field, not a perceptual-quality judgment. The trained submission scores 0.769, with both recorded judges rating its audiovisual continuity 4/4.",
    "caveat": "The base edit uses carry_over instead of the allowed carries_over, so no audiovisual rubric comparison is available. Both trained dialogue judges say the legend begins mid-sentence and loses its essential setup. Music is rated 3/4, with one judge finding the final hit too loud; the judges locate that accent at different joins. This is submission recovery, not proof that an aesthetically zero-quality video became a 0.769-quality video.",
    "size": "9B",
    "number": "05",
    "before": {
      "video": "assets/media/example-05-before.mp4",
      "poster": "assets/media/example-05-before.jpg",
      "score": 0.0,
      "invalid": true,
      "duration": 7.532,
      "sha256": "23738a175d1221b367d2554b9bcd4307316a00f16cfb105a8f2af7fa64b0fe2d"
    },
    "after": {
      "video": "assets/media/example-05-after.mp4",
      "poster": "assets/media/example-05-after.jpg",
      "score": 0.769,
      "invalid": false,
      "duration": 7.166667,
      "sha256": "4f6814d8fe0e955aef5c54ea1d9fd1105c5bc50dde5d01e1c0daf96e98b86f9a"
    }
  },
  {
    "id": "qwen36-35b-a3b-s_4e_thedrama_c11-rep04-prm-fixed",
    "title": "The Drama",
    "model": "Qwen3.6-35B-A3B",
    "method": "GRPO+PRM (fixed \u03bb = 0.5)",
    "task": "s_4e_thedrama_c11",
    "rep": 4,
    "focus": "Narrative speech returns, with rough later cuts",
    "observed": "Compare the opening speech across the first three cuts. The trained edit restores audible dialogue and receives higher dialogue ratings.",
    "caveat": "The line ends on an incomplete word. Later audio chops persist, and judges disagree strongly about music and continuity.",
    "size": "35B",
    "number": "06",
    "before": {
      "video": "assets/media/example-06-before.mp4",
      "poster": "assets/media/example-06-before.jpg",
      "score": 0.375,
      "invalid": false,
      "duration": 9.385,
      "sha256": "3ab11ae98a516e480a31e66f660c0af8b958aad4b4c96d5d54dab3470ecca820"
    },
    "after": {
      "video": "assets/media/example-06-after.mp4",
      "poster": "assets/media/example-06-after.jpg",
      "score": 0.681,
      "invalid": false,
      "duration": 9.386,
      "sha256": "2f567392c26b3d02cbf91c1758cbb526adbb04016b93ca1a7a136534cacb0115"
    }
  },
  {
    "id": "qwen36-35b-a3b-s_4e_deadpoolwolverine_c7-rep01-prm-fixed",
    "title": "Deadpool & Wolverine",
    "model": "Qwen3.6-35B-A3B",
    "method": "GRPO+PRM (fixed \u03bb = 0.5)",
    "task": "s_4e_deadpoolwolverine_c7",
    "rep": 1,
    "focus": "A clearer quip and a timed musical ending",
    "observed": "The recorded judges favor the trained quip over the action and the music timing near the final beat. The reference-conditioned judge still finds the pauses near 2.7 and 7.4 s disruptive.",
    "caveat": "Blind music rises 1\u21924, but reference music remains 3 and dialogue remains 4. The reference bridge score is only 2/4: it criticizes the dips to black that the blind judge praises. Do not claim flawless pacing.",
    "size": "35B",
    "number": "07",
    "before": {
      "video": "assets/media/example-07-before.mp4",
      "poster": "assets/media/example-07-before.jpg",
      "score": 0.524,
      "invalid": false,
      "duration": 8.916667,
      "sha256": "58d4e96c180e17d623be24b41e2efcc5015a467a20e2a2f77a50b57a1a7a0f98"
    },
    "after": {
      "video": "assets/media/example-07-after.mp4",
      "poster": "assets/media/example-07-after.jpg",
      "score": 0.905,
      "invalid": false,
      "duration": 8.875,
      "sha256": "aa9fa8530507943ce69c0f8e4a06ffaf0f7a15a329e67e6ff62c5916b3acad87"
    }
  },
  {
    "id": "qwen36-35b-a3b-s_4e_sinners_c9-rep04-prm-fixed",
    "title": "Sinners",
    "model": "Qwen3.6-35B-A3B",
    "method": "GRPO+PRM (fixed \u03bb = 0.5)",
    "task": "s_4e_sinners_c9",
    "rep": 4,
    "focus": "Sound continuity across cuts",
    "observed": "Both outputs contain audio. The recorded blind judge rates transition execution 0/4 \u2192 4/4 and music 1/4 \u2192 3/4. Compare the cuts around 3\u20135 seconds and the closing dialogue. Dialogue is not fully resolved in the trained output.",
    "caveat": "Same task and evaluation repetition. This inventory includes higher, lower and equal scores, as well as rejected submissions. It is not an estimate of average training effects.",
    "size": "35B",
    "number": "08",
    "before": {
      "video": "assets/media/example-08-before.mp4",
      "poster": "assets/media/example-08-before.jpg",
      "score": 0.206,
      "invalid": false,
      "duration": 10.51,
      "sha256": "b7527ef358d732dfb0298ba2ed02f731e1e7c96f1d6b0f1073c3e69b116e8a08"
    },
    "after": {
      "video": "assets/media/example-08-after.mp4",
      "poster": "assets/media/example-08-after.jpg",
      "score": 0.809,
      "invalid": false,
      "duration": 10.5105,
      "sha256": "c99422f58b931f2caea62849221adbdb6e8ad9a189c2df917e46d36c5ce16f2a"
    }
  }
];
