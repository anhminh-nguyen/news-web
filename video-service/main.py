from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from effect import apply_visual_effect
import textwrap
from faster_whisper import WhisperModel
from moviepy import (
    AudioFileClip,
    CompositeAudioClip,
    CompositeVideoClip,
    ImageClip,
    TextClip,
    VideoFileClip,
    vfx,
)
# from moviepy.config import change_settings
# change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"})


# definition somthings
CANVAS_W = 1080
CANVAS_H = 1920

# Khoảng cách giữa subtitle và mép trên template
SUBTITLE_GAP = 25

# Title nằm cách mép trên template bao nhiêu pixel
TITLE_OFFSET_Y = 55

# Title cách hai bên canvas
TITLE_SIDE_MARGIN = 80


app = FastAPI(title="Gen Z Video Advanced Renderer Service")

class RenderRequest(BaseModel):
    video_dir: str


def get_text_style_for_time(
    storyboard,
    subtitle_start,
    subtitle_end,
):
    subtitle_mid = (
        subtitle_start + subtitle_end
    ) / 2

    for scene in storyboard:
        scene_start = float(
            scene.get("start_time", 0.0)
        )

        scene_end = float(
            scene.get(
                "end_time",
                scene_start + 2.0,
            )
        )

        if scene_start <= subtitle_mid < scene_end:
            return scene.get(
                "text_style",
                "normal_white",
            )

    return "normal_white"


'''Handle API from nextjs'''
@app.post("/render")
def render_video(request: RenderRequest):
    video_dir = os.path.abspath(request.video_dir)

    raw_video_path = os.path.join(video_dir, "video_raw.mp4")
    audio_path = os.path.join(video_dir, "audio.mp3")
    script_path = os.path.join(video_dir, "script.json")
    output_path = os.path.join(video_dir, "final_tiktok.mp4")
    font_path =  "./fonts/BeVietnamPro-SemiBold.ttf"
    template_path = "./template/background.png"

    print("Video directory nhận từ Next.js:", video_dir)
    print("Video tồn tại:", os.path.exists(raw_video_path))
    print("Audio tồn tại:", os.path.exists(audio_path))
    print("Script tồn tại:", os.path.exists(script_path))

    missing_files = []

    if not os.path.exists(raw_video_path):
        missing_files.append(raw_video_path)

    if not os.path.exists(audio_path):
        missing_files.append(audio_path)

    if not os.path.exists(script_path):
        missing_files.append(script_path)

    if missing_files:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Thiếu file nguyên liệu",
                "missing_files": missing_files,
            },
        )

    base_video = None
    main_voiceover = None
    final_clip = None
    final_audio_track = None

    video_segments = []
    txt_clips = []
    opened_sfx_clips = []

    try:
        print(f"Bắt đầu xử lý video tại: {video_dir}")

        # =========================================================
        # ĐỌC SCRIPT JSON
        # =========================================================

        with open(
            script_path,
            "r",
            encoding="utf-8",
        ) as file:
            script_data = json.load(file)

        # Trường hợp file JSON lại chứa một chuỗi JSON
        if isinstance(script_data, str):
            script_data = json.loads(script_data)

        storyboard = script_data.get(
            "visual_storyboard",
            [],
        )

        if not storyboard:
            raise ValueError(
                "visual_storyboard đang rỗng hoặc không tồn tại"
            )

        voiceover_text = script_data.get("voiceover_text",[])



        # =========================================================
        # HÀM WHISPER TẠO SUBTITLE
        # =========================================================

        def transcribe_audio(audio_file_path):
            """
            Whisper nghe file audio và trả về:
            [
                {
                    "start": 0.0,
                    "end": 2.5,
                    "text": "Nội dung..."
                }
            ]
            """

            model = WhisperModel(
                "small",
                device="cpu",
                compute_type="int8",
            )

            segments, info = model.transcribe(
                audio_file_path,
                language="vi",
                beam_size=5,
                vad_filter=True,
                word_timestamps=True,
                initial_prompt=voiceover_text
            )

            print(
                "Ngôn ngữ Whisper nhận diện:",
                info.language,
            )

            subtitles = []
            max_chars = 25

            for segment in segments:
                # Nếu segment không có dữ liệu từ (word), dùng tạm cả segment
                if not segment.words:
                    text = segment.text.strip()
                    if text:
                        subtitles.append({
                            "start": float(segment.start),
                            "end": float(segment.end),
                            "text": text,
                        })
                    continue

                # Lấy danh sách toàn bộ các từ trong segment này
                words_list = list(segment.words)
                
                # Dùng textwrap gom text của các từ lại thành từng dòng vừa vặn
                full_text = " ".join([w.word.strip() for w in words_list])
                wrapped_lines = textwrap.wrap(full_text, width=max_chars)

                word_idx = 0
                for line in wrapped_lines:
                    line_words_count = len(line.split())
                    
                    # Lấy từ đầu tiên và từ cuối cùng của dòng này để tính thời gian start/end
                    start_word = words_list[word_idx]
                    end_word = words_list[min(word_idx + line_words_count - 1, len(words_list) - 1)]
                    
                    subtitles.append({
                        "start": float(start_word.start),
                        "end": float(end_word.end),
                        "text": line.strip()
                    })
                    
                    word_idx += line_words_count

            return subtitles


        # =========================================================
        # KIỂM TRA FILE
        # =========================================================

        required_files = [
            script_path,
            raw_video_path,
            audio_path,
            font_path,
            template_path,
        ]

        for required_file in required_files:
            if not os.path.exists(required_file):
                raise FileNotFoundError(
                    f"Không tìm thấy file: {required_file}"
                )


        # =========================================================
        # ĐỌC VIDEO, AUDIO VÀ TEMPLATE
        # =========================================================

        base_video = VideoFileClip(raw_video_path)
        base_video = base_video.resized(new_size=(CANVAS_W, CANVAS_H))
        main_voiceover = AudioFileClip(audio_path)

        if (
            base_video.duration is None
            or base_video.duration <= 0
        ):
            raise ValueError(
                "Thời lượng video không hợp lệ"
            )

        if (
            main_voiceover.duration is None
            or main_voiceover.duration <= 0
        ):
            raise ValueError(
                "Thời lượng audio không hợp lệ"
            )

        final_duration = main_voiceover.duration

        template = (
            ImageClip(template_path)
            .with_duration(final_duration)
            .with_position(("center", "bottom"))
        )

        # Vị trí bắt đầu của template trên canvas
        template_y = CANVAS_H - template.h

        print("Kích thước video gốc:", base_video.size)
        print("Kích thước template:", template.size)
        print("Template bắt đầu tại y =", template_y)


        # =========================================================
        # LOOP VIDEO NẾU VIDEO NGẮN HƠN AUDIO
        # =========================================================

        if base_video.duration < final_duration:
            base_video = base_video.with_effects(
                [
                    vfx.Loop(
                        duration=final_duration
                    ),
                ]
            )

        base_video = base_video.subclipped(
            0,
            final_duration,
        )


        # =========================================================
        # DANH SÁCH CÁC LAYER
        # =========================================================

        video_segments = []
        subtitle_clips = []
        audio_tracks = [main_voiceover]
        opened_sfx_clips = []


        # =========================================================
        # WHISPER TẠO SUBTITLE MỘT LẦN
        # =========================================================

        subtitle_segments = transcribe_audio(
            audio_path
        )

        print(
            f"Whisper tạo được "
            f"{len(subtitle_segments)} đoạn subtitle"
        )


        # =========================================================
        # XỬ LÝ VIDEO EFFECT VÀ SFX THEO STORYBOARD
        # =========================================================

        for index, scene in enumerate(storyboard):
            scene_start = float(
                scene.get("start_time", 0.0)
            )

            requested_end = float(
                scene.get(
                    "end_time",
                    scene_start + 2.0,
                )
            )

            scene_start = max(
                0.0,
                scene_start,
            )

            scene_end = min(
                requested_end,
                final_duration,
            )

            if (
                scene_start >= final_duration
                or scene_end <= scene_start
            ):
                print(
                    f"Bỏ qua scene {index}: "
                    f"start={scene_start}, "
                    f"end={scene_end}"
                )
                continue

            # -----------------------------------------------------
            # Lấy đoạn video tương ứng scene
            # -----------------------------------------------------

            sub_clip = base_video.subclipped(
                scene_start,
                scene_end,
            )

            effect_name = scene.get(
                "visual_effect",
                "normal",
            )

            processed_sub_clip = apply_visual_effect(
                sub_clip,
                effect_name,
            )

            # Đảm bảo effect không làm thay đổi kích thước cuối
            if processed_sub_clip.size != base_video.size:
                processed_sub_clip = (
                    processed_sub_clip.resized(
                        new_size=base_video.size
                    )
                )

            processed_sub_clip = (
                processed_sub_clip
                .with_start(scene_start)
                .with_duration(
                    scene_end - scene_start
                )
            )

            video_segments.append(
                processed_sub_clip
            )

            # -----------------------------------------------------
            # Thêm SFX
            # -----------------------------------------------------

            sfx_name = str(
                scene.get(
                    "sound_effect",
                    "none",
                )
            ).strip()

            if (
                not sfx_name
                or sfx_name.lower() == "none"
            ):
                continue

            sfx_file_path = os.path.join(
                os.getcwd(),'sfx',
                f"{sfx_name}.mp3",
            )

            if not os.path.exists(sfx_file_path):
                print(
                    "Không tìm thấy file SFX:",
                    sfx_file_path,
                )
                continue

            sfx_clip = AudioFileClip(
                sfx_file_path
            )

            max_sfx_duration = (
                final_duration - scene_start
            )

            if max_sfx_duration <= 0:
                sfx_clip.close()
                continue

            if sfx_clip.duration > max_sfx_duration:
                sfx_clip = sfx_clip.subclipped(
                    0,
                    max_sfx_duration,
                )

            sfx_clip = (
                sfx_clip
                .with_start(scene_start)
                .with_volume_scaled(0.4)
            )

            opened_sfx_clips.append(sfx_clip)
            audio_tracks.append(sfx_clip)


        # =========================================================
        # GHÉP VIDEO GỐC VÀ CÁC ĐOẠN EFFECT
        # =========================================================

        final_video_track = CompositeVideoClip(
            [base_video] + video_segments,
            size=(CANVAS_W, CANVAS_H),
        ).with_duration(final_duration)

        # Giữ nguyên kích thước video gốc
        # Chỉ căn giữa theo chiều ngang và nằm trên cùng
        video_layer = final_video_track.with_position(
            ("center", "top")
        )


        # =========================================================
        # TẠO SUBTITLE
        # Subtitle nằm ngay phía trên template
        # =========================================================

        for subtitle in subtitle_segments:
            subtitle_start = max(
                0.0,
                float(subtitle["start"]),
            )

            subtitle_end = min(
                float(subtitle["end"]),
                final_duration,
            )

            subtitle_text = str(
                subtitle["text"]
            ).strip()

            if (
                not subtitle_text
                or subtitle_end <= subtitle_start
                or subtitle_start >= final_duration
            ):
                continue

            text_style = get_text_style_for_time(
                storyboard,
                subtitle_start,
                subtitle_end,
            )

            font_color = "#F8F8F8"

            if text_style == "highlight_yellow":
                font_color = "#3B82F6"

            elif text_style == "alert_red":
                font_color = "#FFD54A"

            # wrapped_text = "\n".join(textwrap.wrap(subtitle_text.upper(), width=30))
        

            subtitle_clip = TextClip(
                font=font_path,
                # text=wrapped_text,
                text = subtitle_text.upper(),
                font_size=52,
                color=font_color,
                stroke_color="#0A2D73",
                stroke_width=3,
                method="caption",
                size=(CANVAS_W-100,None),
                margin=(10, 6),
                text_align="center",
                duration=(
                    subtitle_end - subtitle_start
                ),
            )

            # Đặt đáy subtitle ngay phía trên template
            subtitle_y = (
                template_y
                - subtitle_clip.h
                - SUBTITLE_GAP
            )

            subtitle_clip = (
                subtitle_clip
                .with_start(subtitle_start)
                .with_position(
                    ("center", subtitle_y)
                )
            )

            subtitle_clips.append(
                subtitle_clip
            )


        # =========================================================
        # TẠO TITLE TRONG VÙNG TRẮNG CỦA TEMPLATE
        # =========================================================

        title_clip = (
            ImageClip("./title_test.png")
            .with_duration(base_video.duration)
        )


        title_clip = title_clip.with_position(
            (
                0,
                template_y + TITLE_OFFSET_Y,
            )
        )

        print ("Đang xử lý video ... ")

        # =========================================================
        # GHÉP AUDIO
        # =========================================================

        final_audio_track = CompositeAudioClip(
            audio_tracks
        ).with_duration(final_duration)

        # =========================================================
        # GHÉP TẤT CẢ LAYER TRÊN CANVAS 1080 × 1920
        # =========================================================

        layers = [
            video_layer,       # Video nằm dưới
            template,          # Template đè vùng dưới video
            *subtitle_clips,   # Subtitle nổi trên video/template
        ]

        if title_clip is not None:
            layers.append(title_clip)

        final_clip = CompositeVideoClip(
            layers,
            size=(CANVAS_W, CANVAS_H),
        ).with_duration(final_duration)

        final_clip = final_clip.with_audio(
            final_audio_track
        )

        final_clip.write_videofile(
            output_path,
            fps=24,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=os.path.join(
                video_dir,
                "temp-audio.m4a",
            ),
            remove_temp=True,
        )

        print("Xuất video thành công:", output_path)

        return {
            "success": True,
            "message": "Đã hoàn thành video bằng Python",
            "output_file": output_path,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(
            f"Lỗi render: {type(error).__name__}: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail={
                "error_type": type(error).__name__,
                "message": str(error),
            },
        )

    finally:
        for clip in txt_clips:
            try:
                clip.close()
            except Exception:
                pass

        for clip in opened_sfx_clips:
            try:
                clip.close()
            except Exception:
                pass

        if final_clip is not None:
            try:
                final_clip.close()
            except Exception:
                pass

        if final_audio_track is not None:
            try:
                final_audio_track.close()
            except Exception:
                pass

        if main_voiceover is not None:
            try:
                main_voiceover.close()
            except Exception:
                pass

        if base_video is not None:
            try:
                base_video.close()
            except Exception:
                pass