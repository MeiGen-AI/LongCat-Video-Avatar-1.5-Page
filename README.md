# LongCat-Video-Avatar 1.5

<div align="center">
  <img src="assets/icons/longcat_video_avatar_1.5_title.svg" width="45%" alt="LongCat-Video-Avatar 1.5" />
</div>
<hr>

<div align="center" style="line-height: 1;">
  <a href='https://meigen-ai.github.io/LongCat-Video-Avatar-1.5-Page/'><img src='https://img.shields.io/badge/Project-Page-green'></a>
  <a href='https://github.com/meituan-longcat/LongCat-Video/blob/main/assets/LongCat-Video-Avatar-Tech-Report.pdf'><img src='https://img.shields.io/badge/Technique-Report-red'></a>
  <a href='https://github.com/meituan-longcat/LongCat-Video'><img src='https://img.shields.io/badge/Code-GitHub-black?logo=github'></a>
  <a href='https://huggingface.co/meituan-longcat/LongCat-Video-Avatar-1.5'><img src='https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Model-blue'></a>
</div>

<div align="center" style="line-height: 1;">
  <a href='https://github.com/meituan-longcat/LongCat-Flash-Chat/blob/main/figures/wechat_official_accounts.png'><img src='https://img.shields.io/badge/WeChat-LongCat-brightgreen?logo=wechat&logoColor=white'></a>  
  <a href='https://x.com/Meituan_LongCat'><img src='https://img.shields.io/badge/Twitter-LongCat-white?logo=x&logoColor=white'></a>
</div>

<div align="center" style="line-height: 1;">
  <a href='LICENSE'><img src='https://img.shields.io/badge/License-MIT-f5de53?&color=f5de53'></a>
</div>


## 🔥 Latest News
* May 19, 2026: 🚀 We are excited to announce **[LongCat-Video-Avatar 1.5](https://meigen-ai.github.io/LongCat-Video-Avatar-1.5-Page/)**, the latest open-source release in the LC Avatar series for high-quality audio-driven video generation. Version 1.5 improves stability, lip-sync accuracy, long-video consistency, and generation speed, bringing research-grade avatar generation closer to production-ready use.
* Dec 16, 2025: We released **[LongCat-Video-Avatar](https://github.com/MeiGen-AI/LongCat-Video-Avatar)**, a unified model that delivers expressive and highly dynamic audio-driven character animation, supporting native tasks including Audio-Text-to-Video, Audio-Text-Image-to-Video, and Video Continuation with seamless compatibility for both single-stream and multi-stream audio inputs. The release includes our Technical Report, [code](https://github.com/meituan-longcat/LongCat-Video), [model weights](https://huggingface.co/meituan-longcat/LongCat-Video-Avatar-1.5), and [project page](https://meigen-ai.github.io/LongCat-Video-Avatar/).

## ✨ Key Features: 
- **Stronger Lip-Sync and Stability**: LongCat-Video-Avatar 1.5 adopts a Whisper-large audio encoder to produce more accurate, natural, and fluent mouth movements.
- **Fine-Grained Audio-Visual Alignment**: Multi-stage data processing and per-frame strategy optimization help align speech with lip motion and facial expression while maintaining consistency in long videos.
- **Consistent Full-Body Motion**: The model preserves temporal coherence across full-body movements, reducing motion jitter and identity drift over extended generation.
- **Robust Identity Preservation**: LongCat-Video-Avatar 1.5 keeps character identity stable across frames and adapts to challenging scenarios such as multi-person videos and hand-object interactions.
- **Fast 8-Step Generation**: With Distribution Matching Distillation (DMD), the model can generate high-quality videos in only 8 steps, significantly improving inference speed while preserving visual quality.
- **Competitive Human Preference**: Evaluations show that LongCat-Video-Avatar 1.5 outperforms OmniHuman 1.5, HeyGen, and Kling Avatar 2.0 in stability, consistency, and natural lip motion, with stronger overall human preference.
- **Support Multiple Generation Modes**: One unified model can be used for Audio-Text-to-Video (AT2V), Audio-Text-Image-to-Video (ATI2V), and Video Continuation.
