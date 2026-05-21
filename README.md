# LongCat-Video-Avatar 1.5

<div align="center">
  <img src="assets/icons/longcat_video_avatar_1.5_title.webp" width="45%" alt="LongCat-Video-Avatar 1.5" />
</div>
<hr>

<div align="center" style="line-height: 1;">
  <a href='https://meigen-ai.github.io/LongCat-Video-Avatar-1.5/'><img src='https://img.shields.io/badge/Project-Page-green'></a>
  <a href='https://github.com/meituan-longcat/LongCat-Video/blob/lcavatar_v1d5/assets/LongCat-Video-Avatar-1.5-Tech-Report.pdf'><img src='https://img.shields.io/badge/Technique-Report-red'></a>
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
* May 21, 2026: 🚀 We release [***LongCat-Video-Avatar-1.5***](https://meigen-ai.github.io/LongCat-Video-Avatar-1.5/), an upgraded open-source framework for audio-driven human video generation. v1.5 replaces Wav2Vec2 with Whisper-Large for more accurate lip synchronization, achieves production-ready physical rationality and temporal stability with robust long-video generation, generalizes to stylized domains (anime, animals, complex real-world conditions), supports both single-stream and multi-stream audio inputs, and accelerates inference to 8 steps via step distillation. [ [***code***](https://github.com/meituan-longcat/LongCat-Video) | 🤗 [***weights***](https://huggingface.co/meituan-longcat/LongCat-Video-Avatar-1.5) | [***project page***](https://meigen-ai.github.io/LongCat-Video-Avatar-1.5/) ]

## ✨ Key Features
- **Upgraded Audio Encoder (Whisper-Large)**: Replaces Wav2Vec2 with Whisper-Large, yielding significantly smoother and more natural lip dynamics.
- **Production-Ready Stability**: Achieves accurate lip-synchronization, full-body temporal stability, and robust long-video generation with strict identity consistency.
- **Stylized Domain Generalization**: Robustly generalizes to anime, animals, and complex real-world conditions such as multi-person interactions and object handling.
- **Efficient 8-Step Inference**: Advanced DMD2-based step distillation accelerates inference to 8 NFE, balancing cost-effective serving with exceptional visual fidelity.

## 📊 Human Evaluation
We introduce a comprehensive human evaluation benchmark specifically tailored for audio-driven digital human generation. The benchmark encompasses 6 application scenarios (News Broadcasting, Knowledge Education, Daily Life, Entertainment, Singing, Commercial Promotion), 2 languages (Chinese/English), and 2 visual styles (Realistic/Animated), yielding a total of 508 image-audio source pairs.

Evaluation Methodology: (1) Subjective Track: 770 crowdsourced evaluators rated each generated video on a 1-5 human-likeness scale, yielding 13,240 judgments. (2) Objective Track: 10 domain experts conducted structured quality analysis across four dimensions: Physical Rationality, Harmony (Audio-Visual Coordination), Temporal Stability, and Identity Consistency. The results are shown in the following figure: (a) Expert-level objective quality evaluation across four dimensions. (b) Subjective human-likeness comparison with leading commercial models.

<div align="center">
  <img src="assets/human_evaluation.webp" width="95%" alt="Human Evaluation Results" />
</div>
