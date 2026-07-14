from moviepy import vfx

def apply_visual_effect(clip, effect_name):
    """
    Tạo 8 hiệu ứng chuyển động cho MoviePy 2.x.

    Phù hợp video TikTok dọc 9:16:
    - zoom_in
    - zoom_out
    - pan_left
    - pan_right
    - pan_up
    - pan_down
    - zoom_in_left
    - zoom_in_right
    """

    duration = clip.duration
    original_w, original_h = clip.size

    if duration is None or duration <= 0:
        return clip

    # Video dọc cần chuyển động rõ hơn video ngang.
    is_portrait = original_h > original_w

    zoom_amount = 0.20 if is_portrait else 0.14
    pan_scale = 1.60 if is_portrait else 1.12

    def progress(t):
        """Đưa thời gian hiện tại về khoảng 0.0 -> 1.0."""
        return min(max(t / duration, 0.0), 1.0)

    def smooth_progress(t):
        """
        Chuyển động mượt hơn linear thông thường:
        đầu chậm -> giữa nhanh -> cuối chậm.
        """
        p = progress(t)
        return p * p * (3.0 - 2.0 * p)

    def crop_frame(frame, x_center, y_center):
        """
        Lấy một khung có kích thước bằng video gốc
        từ frame đã được phóng lớn.
        """

        frame_h, frame_w = frame.shape[:2]

        x1 = int(x_center - original_w / 2)
        y1 = int(y_center - original_h / 2)

        # Không cho vùng crop chạy ra ngoài frame.
        x1 = max(0, min(x1, frame_w - original_w))
        y1 = max(0, min(y1, frame_h - original_h))

        return frame[
            y1:y1 + original_h,
            x1:x1 + original_w,
        ]

    # =========================================================
    # 1. ZOOM IN: từ 100% lên 120%
    # =========================================================
    if effect_name == "zoom_in":

        resized_clip = clip.with_effects([
            vfx.Resize(
                new_size=lambda t:
                    1.0 + zoom_amount * smooth_progress(t*20)
            )
        ])

        def zoom_in_frame(get_frame, t):
            frame = get_frame(t)
            frame_h, frame_w = frame.shape[:2]

            return crop_frame(
                frame,
                x_center=frame_w / 2,
                y_center=frame_h / 2,
            )

        return resized_clip.transform(zoom_in_frame)

    # =========================================================
    # 2. ZOOM OUT: từ 120% về 100%
    # =========================================================
    elif effect_name == "zoom_out":

        resized_clip = clip.with_effects([
            vfx.Resize(
                new_size=lambda t:
                    1.0 + zoom_amount * (1.0 - smooth_progress(t))
            )
        ])

        def zoom_out_frame(get_frame, t):
            frame = get_frame(t)
            frame_h, frame_w = frame.shape[:2]

            return crop_frame(
                frame,
                x_center=frame_w / 2,
                y_center=frame_h / 2,
            )

        return resized_clip.transform(zoom_out_frame)

    # =========================================================
    # Chuẩn bị clip lớn hơn cho các hiệu ứng pan
    # =========================================================
    elif effect_name in {
        "pan_left",
        "pan_right",
        "pan_up",
        "pan_down",
        "zoom_in_left",
        "zoom_in_right",
    }:

        enlarged_clip = clip.resized(pan_scale)

        enlarged_w, enlarged_h = enlarged_clip.size

        max_x_offset = enlarged_w - original_w
        max_y_offset = enlarged_h - original_h

        center_x1 = max_x_offset / 2
        center_y1 = max_y_offset / 2

        # =====================================================
        # 3. PAN LEFT
        #
        # Khung nhìn chạy từ trái sang phải trên frame lớn,
        # nên nội dung trông như đang di chuyển sang trái.
        # =====================================================
        if effect_name == "pan_left":

            def pan_left_frame(get_frame, t):
                frame = get_frame(t)
                p = smooth_progress(t)

                x1 = max_x_offset * p
                y1 = center_y1

                return frame[
                    int(y1):int(y1) + original_h,
                    int(x1):int(x1) + original_w,
                ]

            return enlarged_clip.transform(pan_left_frame)

        # =====================================================
        # 4. PAN RIGHT
        # =====================================================
        elif effect_name == "pan_right":

            def pan_right_frame(get_frame, t):
                frame = get_frame(t)
                p = smooth_progress(t)

                x1 = max_x_offset * (1.0 - p)
                y1 = center_y1

                return frame[
                    int(y1):int(y1) + original_h,
                    int(x1):int(x1) + original_w,
                ]

            return enlarged_clip.transform(pan_right_frame)

        # =====================================================
        # 5. PAN UP
        #
        # Khung nhìn đi từ trên xuống dưới,
        # nên nội dung trông như chạy lên.
        # =====================================================
        elif effect_name == "pan_up":

            def pan_up_frame(get_frame, t):
                frame = get_frame(t)
                p = smooth_progress(t)

                x1 = center_x1
                y1 = max_y_offset * p

                return frame[
                    int(y1):int(y1) + original_h,
                    int(x1):int(x1) + original_w,
                ]

            return enlarged_clip.transform(pan_up_frame)

        # =====================================================
        # 6. PAN DOWN
        # =====================================================
        elif effect_name == "pan_down":

            def pan_down_frame(get_frame, t):
                frame = get_frame(t)
                p = smooth_progress(t)

                x1 = center_x1
                y1 = max_y_offset * (1.0 - p)

                return frame[
                    int(y1):int(y1) + original_h,
                    int(x1):int(x1) + original_w,
                ]

            return enlarged_clip.transform(pan_down_frame)

        # =====================================================
        # 7. ZOOM IN LEFT
        #
        # Vừa zoom vào vừa hướng camera về phía trái.
        # =====================================================
        elif effect_name == "zoom_in_left":

            resized_clip = clip.with_effects([
                vfx.Resize(
                    new_size=lambda t:
                        1.0 + zoom_amount * smooth_progress(t)
                )
            ])

            def zoom_left_frame(get_frame, t):
                frame = get_frame(t)
                frame_h, frame_w = frame.shape[:2]
                p = smooth_progress(t)

                min_center_x = original_w / 2
                center_center_x = frame_w / 2

                # Từ giữa chạy dần về vùng bên trái.
                x_center = (
                    center_center_x
                    + (min_center_x - center_center_x) * p
                )

                return crop_frame(
                    frame,
                    x_center=x_center,
                    y_center=frame_h / 2,
                )

            return resized_clip.transform(zoom_left_frame)

        # =====================================================
        # 8. ZOOM IN RIGHT
        #
        # Vừa zoom vào vừa hướng camera về phía phải.
        # =====================================================
        elif effect_name == "zoom_in_right":

            resized_clip = clip.with_effects([
                vfx.Resize(
                    new_size=lambda t:
                        1.0 + zoom_amount * smooth_progress(t)
                )
            ])

            def zoom_right_frame(get_frame, t):
                frame = get_frame(t)
                frame_h, frame_w = frame.shape[:2]
                p = smooth_progress(t)

                center_center_x = frame_w / 2
                max_center_x = frame_w - original_w / 2

                # Từ giữa chạy dần về vùng bên phải.
                x_center = (
                    center_center_x
                    + (max_center_x - center_center_x) * p
                )

                return crop_frame(
                    frame,
                    x_center=x_center,
                    y_center=frame_h / 2,
                )

            return resized_clip.transform(zoom_right_frame)

    return clip