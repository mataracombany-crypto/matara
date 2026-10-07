import os
import json

products_dir = "products"
products = []

if os.path.exists(products_dir):
    for folder_name in sorted(os.listdir(products_dir)):
        folder_path = os.path.join(products_dir, folder_name)
        if not os.path.isdir(folder_path):
            continue

        images = []
        desc = ""
        desc_file = ""

        for file in sorted(os.listdir(folder_path)):
            file_path = os.path.join(folder_path, file)
            if not os.path.isfile(file_path):
                continue
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']:
                images.append(file)
            elif ext == '.txt':
                desc_file = file
                try:
                    with open(file_path, 'r', encoding='utf-8-sig') as tf:
                        desc = tf.read().strip()
                except Exception:
                    try:
                        with open(file_path, 'r', encoding='cp1256') as tf:
                            desc = tf.read().strip()
                    except Exception:
                        desc = ""

        if images:
            products.append({
                "id": folder_name,
                "name": folder_name,
                "folder": folder_name,
                "images": images,
                "description": desc,
                "descriptionFile": desc_file
            })

js = "window.PRODUCTS = " + json.dumps(products, ensure_ascii=False, indent=2) + ";\n"

with open("js/products.js", "w", encoding="utf-8") as f:
    f.write(js)

with open("products.json", "w", encoding="utf-8") as f:
    json.dump({"products": products}, f, ensure_ascii=False, indent=2)

print(f"OK: {len(products)} products")
