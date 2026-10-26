# VideoEdit project website

Project page for **When Fine-Grained Credit Assignment Helps and Hurts: Multimodal Agentic Reinforcement Learning through Video Editing**, by Lei Zhao, Zongheng Cao, and Xinyu Hu.

This repository contains only the static project website and the 20 explicitly selected before/after examples. The training code lives in [video-editing-credit-assignment](https://github.com/leizhao7/video-editing-credit-assignment). Model cards are at [VideoEdit-Qwen3.5-9B](https://huggingface.co/leizhao7/VideoEdit-Qwen3.5-9B) and [VideoEdit-Qwen3.6-35B-A3B](https://huggingface.co/leizhao7/VideoEdit-Qwen3.6-35B-A3B).

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
- `assets/examples.js`: the 20 selected same-task, same-repetition comparisons, their original clips, individual scores and qualified recorded observations.
- `assets/site.js`: muted preview cards, an on-demand comparison dialog with synchronized playback and audio-side selection, model filtering, viewport-aware muted previews and accessible comparison controls.
- `assets/style.css`: responsive layout, typography and colors.

The original 480p showcase videos are byte-identical to the selected recorded model outputs, including their original audio. They are selected individual rollouts, not unbiased estimates of average training effects. One base submission failed validation; its zero is a validation result, not a perceptual-quality score. The example metadata records this and retains qualifications about rendering completion and remaining editing defects.

The recorded videos are 854 × 480 and remain available through **Original**. Where available, the **HD reconstruction** option uses frame-aligned HD source footage and recreates the model's own title-card designs from saved rendering recipes. Both sides retain their original frame presentation timestamps, duration, and audio packet payloads and timing. No new model rollout or grading is performed, and all scores in the example metadata belong to the original evaluation files. Six ambiguous transition frames in the first untrained example retain the original pixels; incomplete renders and editing defects are preserved. These presentation files are explicitly separate from the immutable scored artifacts.

The featured player preserves the full source aspect ratio and places the film-switching dots and pause control below the picture. Its width is capped at 854 CSS pixels so the 1920 × 1080 reconstruction remains crisp on a Retina display. HD provenance hashes, frame counts, and verification results are in [assets/hd-renders.json](assets/hd-renders.json).

The 20 previews form a responsive mosaic with a larger opening tile and wide accents, with no text overlays. Lightweight silent excerpts of up to four seconds play only while visible and pause when a comparison opens, the page is hidden, or the preview pause control is selected. Reduced-motion settings start the mosaic paused. Mosaic tiles may crop the framing for the layout; comparison players preserve the full frame. Newly added examples use the exact original renders; HD controls appear only for pairs with verified reconstructions. Previews show the footage without text overlays. Clicking the featured video or a gallery card opens a dark paired viewer with shared playback, audio and resolution controls. Close it with the close button, Escape or the backdrop; closing pauses both videos and returns focus to the preview. Individual scores and recorded analysis remain in `assets/examples.js` and `assets/examples.json`, rather than appearing in the viewer.

Site-authored HTML, CSS and JavaScript are MIT licensed. The film posters and video excerpts remain subject to their respective rights; they are not covered by the website code license. Poster credits are in [POSTER_CREDITS.md](POSTER_CREDITS.md).

The visual layout follows the requested research-project reference: a white canvas, a blue–purple project title, Geist typography, a large featured visual, numbered sections and a media-led showcase grid. The site uses its own content, artwork and video outputs. Geist is bundled locally under the SIL Open Font License; see [assets/fonts/OFL.txt](assets/fonts/OFL.txt).

The second section presents the scalable task-generation pipeline through the 49-film poster collage, four independently constructed task types, and the generated/retained task counts. The task diagrams reuse the corresponding panels of `assets/editing-tasks.svg`, laid out as four columns on desktop and two on mobile.

The poster wall is rebuilt at 6014 × 1599 from the 49 cached native poster images, with 1280px and 2560px WebP variants for page loading. Clicking the wall opens the full-resolution PNG. Task panels remain vector SVG.

The opening hook, “Teaching AI to Edit Videos with 49 Real Films,” sits above the project name; the paper title remains beneath it. A short introduction before the featured video describes the task-generation, training, and grading components.

Each of the three findings has separate evidence: `assets/finding-task-gains.svg` shows relative gains from the audited four-decimal means; `assets/finding-reward-hacking.svg` preserves the recorded reward observations, centered five-observation means, and cubic λ schedule from the existing README figure; the behavior table reports all seven metrics from the paper's model-behavior table for outcome-only GRPO and both PRM variants. The metrics are grouped into visual inspection, reasoning, and interaction/completion. These use the main 9B comparison and introduce no new experiments. Validation truncation rates are distinct from the training curves. The two SVG plots have separate narrow-screen compositions so their labels remain legible on phones. The source metric export stays outside this repository. The task comparison does not isolate complexity from horizon or scoring criteria, and behavior counts do not establish reasoning quality.

The title background reuses the credited poster collage through CSS blur, desaturation, rotation, and a white central mask. No poster pixels are changed. Model cards compare the untrained base, outcome-only GRPO, and the released VideoEdit checkpoint using the corresponding Hugging Face model-card figures: avg@4 for 9B and three complete repetitions (avg@3) for 35B. The 35B retained repetition subsets differ between policies; the linked model card provides the full protocol.
