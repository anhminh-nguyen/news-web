from pathlib import Path
from PIL import Image,ImageDraw, ImageFont

WIDTH = 1080
HEIGHT = 360

COLOR_BLACK = '#111111'
COLOR_BLUE = '#1677FF'
COLOR_TRANSPARENT = (255,255,255,0)

def load_font (font_path:str, size:int) -> ImageFont.FreeTypeFont:
    path = Path(font_path)


    if not path.exists:
        raise FileNotFoundError(f"Không tìm thấy font: {path}")

def create_title_image(output_path:str,font_path:str)->None:
    image = Image.new(
        mode='RGBA',
        size = (WIDTH, HEIGHT),
        color = COLOR_TRANSPARENT,
        )
    
    draw = ImageDraw.Draw(image)

    font_black = ImageFont.truetype("./fonts/BeVietnamPro-ExtraBold.ttf",60)
    font_blue = ImageFont.truetype("./fonts/BeVietnamPro-ExtraBold.ttf",65)

    left = 70

    draw.rounded_rectangle(
        (40,35,55,325),
        radius=6,
        fill=COLOR_BLUE
    )

  # Sự thật rùng mình: Tại sao hàm răng hải ly không bao giờ bị mòn dù gặm gỗ cả đời?
    draw.text(
        (left,45),
        "TẠI SAO HÀM RĂNG HẢI LY",
        font = font_black,
        fill=COLOR_BLUE

    )

    draw.text(
        (left,145),
        "KHÔNG BAO GIỜ BỊ",
        font = font_blue,
        fill=COLOR_BLACK

    )
    draw.text(
        (left,255),
        "BÀO MÒN DÙ GẶM GỖ CẢ ĐỜI?",
        font = font_black,
        fill=COLOR_BLUE

    )

    print(font_blue)

    image.save(output_path,format = 'PNG')

    print(f"Da tao anh title: {output_path}")



if __name__ == "__main__":
    create_title_image(
        output_path="title_test.png",
        font_path="./fonts/BeVietnamPro-ExtraBold.ttf",
    )


