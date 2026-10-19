import fitz
import os
from PIL import Image

os.makedirs('assets/artworks', exist_ok=True)
os.makedirs('assets/artworks/thumbs', exist_ok=True)
os.makedirs('assets/profile', exist_ok=True)

# 1. Extract CV images
print("Extracting CV images...")
cv_doc = fitz.open('Pauv Soneasa Cv.pdf')
for i, img in enumerate(cv_doc[0].get_images()):
    xref = img[0]
    base = cv_doc.extract_image(xref)
    ext = base['ext']
    w, h = base['width'], base['height']
    filename = f"assets/profile/cv_img_{i}_{w}x{h}.{ext}"
    with open(filename, 'wb') as f:
        f.write(base['image'])
    print(f"Saved: {filename} ({w}x{h})")

# 2. Extract Portfolio Pages / Images
print("\nExtracting Portfolio pages...")
port_doc = fitz.open('SOK SEREYVISAL-Portfolio.pdf')
print(f"Total pages: {len(port_doc)}")

for page_idx in range(len(port_doc)):
    page = port_doc[page_idx]
    # We can render the page to a clean web-ready JPEG with reasonable size
    # 4500x3000 is huge (takes many MBs to load on web). Let's render at ~1800x1200 for full view and ~600x400 for thumbnails
    # Scale factor: 1800 / 4500 = 0.4
    zoom_full = 1800 / page.rect.width
    mat_full = fitz.Matrix(zoom_full, zoom_full)
    pix_full = page.get_pixmap(matrix=mat_full, alpha=False)
    full_path = f"assets/artworks/artwork_{page_idx+1:02d}.jpg"
    pix_full.save(full_path, "jpeg")
    
    # Thumbnail
    zoom_thumb = 600 / page.rect.width
    mat_thumb = fitz.Matrix(zoom_thumb, zoom_thumb)
    pix_thumb = page.get_pixmap(matrix=mat_thumb, alpha=False)
    thumb_path = f"assets/artworks/thumbs/artwork_{page_idx+1:02d}_thumb.jpg"
    pix_thumb.save(thumb_path, "jpeg")

    print(f"Page {page_idx+1}: saved {full_path} ({pix_full.width}x{pix_full.height}) & thumb")

print("Done extracting assets!")
