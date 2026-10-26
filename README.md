# VideoEdit project website

Project page for **When Fine-Grained Credit Assignment Helps and Hurts: Multimodal Agentic Reinforcement Learning through Video Editing**, by Lei Zhao, Zongheng Cao, and Xinyu Hu.

This repository contains only the static project website and the eight explicitly selected before/after examples. The training code lives in [video-editing-credit-assignment](https://github.com/leizhao7/video-editing-credit-assignment). Model cards are at [VideoEdit-Qwen3.5-9B](https://huggingface.co/leizhao7/VideoEdit-Qwen3.5-9B) and [VideoEdit-Qwen3.6-35B-A3B](https://huggingface.co/leizhao7/VideoEdit-Qwen3.6-35B-A3B).

## Local preview

No build step or dependencies are required:

```bash
python3 -m http.server 8850 --bind 127.0.0.1
```

Open <http://127.0.0.1:8850/>. Serve over HTTP; JavaScript modules do not work from `file://`.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the static files when `main` changes. Enable **Settings → Pages → Source → GitHub Actions** in the repository. GitHub Pages availability depends on the repository visibility and account plan.

## Content updates

- `index.html`: paper information, section text, model links and software citation. The paper link is marked forthcoming until a verified URL is available.
- `assets/examples.js`: the eight selected same-task, same-repetition comparisons, their original clips, individual scores and qualified recorded observations.
- `assets/site.js`: synchronized playback, audio-side selection, example filtering and keyboard-accessible task tabs.
- `assets/style.css`: responsive layout, typography and colors.

The showcase videos are byte-identical to the selected recorded model outputs, including their original audio. They are selected individual rollouts, not unbiased estimates of average training effects. One base submission failed validation; the website explicitly labels it rather than presenting zero as a perceptual-quality score. Some comparisons show rendering completion or remaining defects; their notes retain these qualifications.

Site-authored HTML, CSS and JavaScript are MIT licensed. The film posters and video excerpts remain subject to their respective rights; they are not covered by the website code license. Poster credits are in [POSTER_CREDITS.md](POSTER_CREDITS.md).
