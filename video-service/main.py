from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from moviepy import VideoFileClip, AudioFileClip, TextClip, CompositeVideoClip, CompositeAudioClip
from moviepy import vfx


# Configuration cho ImageMagick trên Windows (Sửa đường dẫn nếu cần)
# from moviepy.config import change_settings
# change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"})

app = FastAPI(title="Gen Z Video Advanced Renderer Service")

class RenderRequest(BaseModel):
    video_dir: str

# --- 🛠️ CÁC HÀM TẠO HIỆU ỨNG HÌNH ẢNH (VISUAL EFFECTS) ---

def apply_visual_effect(clip, effect_name):
    """Tạo hiệu ứng chuyển động cho MoviePy 2.1.2."""

    duration = clip.duration
    width, height = clip.size

    if duration is None or duration <= 0:
        return clip

    def progress(t):
        return min(max(t / duration, 0.0), 1.0)

    if effect_name == "zoom_in":
        return clip.with_effects([
            vfx.Resize(
                new_size=lambda t: 1.0 + 0.15 * progress(t)
            ),
            vfx.Crop(
                width=width,
                height=height,
                x_center=width / 2,
                y_center=height / 2,
            ),
        ])

    elif effect_name == "zoom_out":
        return clip.with_effects([
            vfx.Resize(
                new_size=lambda t: 1.15 - 0.15 * progress(t)
            ),
            vfx.Crop(
                width=width,
                height=height,
                x_center=width / 2,
                y_center=height / 2,
            ),
        ])

    elif effect_name == "pan_left":
        scale = 1.08
        enlarged_width = int(width * scale)

        enlarged_clip = clip.resized(
            new_size=(enlarged_width, height)
        )

        max_offset = enlarged_width - width

        return enlarged_clip.transform(
            lambda get_frame, t: get_frame(t)[
                :,
                int(max_offset * progress(t)):
                int(max_offset * progress(t)) + width
            ]
        )

    elif effect_name == "pan_right":
        scale = 1.08
        enlarged_width = int(width * scale)

        enlarged_clip = clip.resized(
            new_size=(enlarged_width, height)
        )

        max_offset = enlarged_width - width

        return enlarged_clip.transform(
            lambda get_frame, t: get_frame(t)[
                :,
                int(max_offset * (1.0 - progress(t))):
                int(max_offset * (1.0 - progress(t))) + width
            ]
        )

    return clip




@app.post("/render")
def render_video(request: RenderRequest):
    video_dir = os.path.abspath(request.video_dir)

    raw_video_path = os.path.join(video_dir, "video_raw.mp4")
    audio_path = os.path.join(video_dir, "audio.mp3")
    script_path = os.path.join(video_dir, "script.json")
    output_path = os.path.join(video_dir, "final_tiktok.mp4")

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

        with open(script_path, "r", encoding="utf-8") as file:
            script_data = json.load(file)

        # Phòng trường hợp script.json chứa một chuỗi JSON
        if isinstance(script_data, str):
            script_data = json.loads(script_data)

        storyboard = script_data.get("visual_storyboard", [])

        if not storyboard:
            raise ValueError("visual_storyboard đang rỗng hoặc không tồn tại")

        base_video = VideoFileClip(raw_video_path)
        main_voiceover = AudioFileClip(audio_path)

        final_duration = min(
            main_voiceover.duration,
            base_video.duration,
        )

        if final_duration <= 0:
            raise ValueError("Thời lượng video hoặc audio không hợp lệ")

        base_video = base_video.subclipped(0, final_duration)

        audio_tracks = [main_voiceover.subclipped(0, final_duration)]

        font_path = r"C:\Windows\Fonts\arialbd.ttf"

        if not os.path.exists(font_path):
            font_path = None
            print("Không tìm thấy Arial Bold, dùng font mặc định")

        for index, scene in enumerate(storyboard):
            start = float(scene.get("start_time", 0.0))
            requested_end = float(scene.get("end_time", start + 2.0))

            start = max(0.0, start)
            end = min(requested_end, final_duration)

            if start >= final_duration or end <= start:
                print(
                    f"Bỏ qua scene {index}: "
                    f"start={start}, end={end}"
                )
                continue

            sub_clip = base_video.subclipped(start, end)

            effect_name = scene.get("visual_effect", "normal")
            processed_sub_clip = apply_visual_effect(
                sub_clip,
                effect_name,
            )

            # Đảm bảo tất cả phân đoạn có cùng kích thước
            if processed_sub_clip.size != base_video.size:
                processed_sub_clip = processed_sub_clip.resized(
                    new_size=base_video.size
                )

            processed_sub_clip = (
                processed_sub_clip
                .with_start(start)
                .with_duration(end - start)
            )

            video_segments.append(processed_sub_clip)

            text = str(scene.get("subtitle_segment", "")).strip()
            style = scene.get("text_style", "normal_white")

            if text:
                font_color = "white"

                if style == "highlight_yellow":
                    font_color = "yellow"
                elif style == "alert_red":
                    font_color = "red"

                txt_clip = TextClip(
                    font=font_path,
                    text=text,
                    font_size=45,
                    color=font_color,
                    stroke_color="black",
                    stroke_width=2,
                    method="caption",
                    size=(base_video.w - 100, None),
                    text_align="center",
                    duration=end - start,
                )

                txt_clip = (
                    txt_clip
                    .with_start(start)
                    .with_position(("center", "center"))
                )

                txt_clips.append(txt_clip)

            sfx_name = scene.get("sound_effect", "none")

            if sfx_name and sfx_name != "none":
                sfx_file_path = os.path.join(
                    os.getcwd(),
                    "sfx",
                    f"{sfx_name}.mp3",
                )

                if os.path.exists(sfx_file_path):
                    sfx_clip = AudioFileClip(sfx_file_path)

                    # Không cho SFX vượt quá cuối video
                    max_sfx_duration = final_duration - start

                    if sfx_clip.duration > max_sfx_duration:
                        sfx_clip = sfx_clip.subclipped(
                            0,
                            max_sfx_duration,
                        )

                    sfx_clip = sfx_clip.with_start(start)

                    opened_sfx_clips.append(sfx_clip)
                    audio_tracks.append(sfx_clip)
                else:
                    print(
                        "Không tìm thấy file SFX:",
                        sfx_file_path,
                    )

        if not video_segments:
            raise ValueError(
                "Không tạo được phân đoạn video nào từ storyboard"
            )

        final_video_track = CompositeVideoClip(
            video_segments,
            size=base_video.size,
        ).with_duration(final_duration)

        final_audio_track = CompositeAudioClip(
            audio_tracks
        ).with_duration(final_duration)

        final_clip = CompositeVideoClip(
            [final_video_track] + txt_clips,
            size=base_video.size,
        )

        final_clip = (
            final_clip
            .with_audio(final_audio_track)
            .with_duration(final_duration)
        )

        print("Đang render video...")

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
            "message": "Render full hiệu ứng thành công",
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