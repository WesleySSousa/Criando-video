import sys, glob
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
files = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
h = int(ims[0].height * w / ims[0].width)
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * (w + 6) + 6, rows * (h + 6) + 6), (16, 16, 20))
d = ImageDraw.Draw(S)
for i, im in enumerate(ims):
    x, y = 6 + (i % cols) * (w + 6), 6 + (i // cols) * (h + 6)
    S.paste(im.resize((w, h), Image.LANCZOS), (x, y))
    d.rectangle([x, y, x + 54, y + 22], fill=(0, 0, 0)); d.text((x + 4, y + 5), files[i].split('/')[-1].split('_')[-1].replace('.jpg', '').replace('.png', ''), fill=(255, 255, 255))
S.save(out, quality=90)
