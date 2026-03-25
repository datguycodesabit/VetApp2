from flask import Flask, request, jsonify, send_from_directory
import os
import time
import easyocr

app = Flask(__name__, static_folder="client", static_url_path="")

@app.route("/")
def index():
    return send_from_directory("client", "index.html")

UPLOAD_FOLDER = 'uploads'
IMAGE_FOLDER = os.path.join(UPLOAD_FOLDER, 'images')
TEXT_FOLDER = os.path.join(UPLOAD_FOLDER, 'text')

os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(TEXT_FOLDER, exist_ok=True)

reader = easyocr.Reader(['en'])

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    image_file = request.files['image']
    timestamp = int(time.time() * 1000)

    temp_filename = f"{timestamp}_temp.jpg"
    temp_path = os.path.join(IMAGE_FOLDER, temp_filename)
    image_file.save(temp_path)

    ocr_result = reader.readtext(temp_path, detail=0)
    text_output = ' '.join(ocr_result).strip() or 'NoText'

    snippet = '_'.join(text_output.split()[:3]).replace('/', '_').replace('\\','_')
    if not snippet:
        snippet = 'capture'

    # rename image file
    final_image_filename = f"{timestamp}_{snippet}.jpg"
    final_image_path = os.path.join(IMAGE_FOLDER, final_image_filename)
    os.rename(temp_path, final_image_path)

    text_filename = f"{timestamp}_{snippet}.txt"
    text_path = os.path.join(TEXT_FOLDER, text_filename)
    with open(text_path, 'w', encoding='utf-8') as f:
        f.write(text_output)

    return jsonify({
        'message': 'Upload successful',
        'image': final_image_filename,
        'text': text_filename
    })

@app.route('/uploads/images/<filename>')
def uploaded_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

@app.route('/uploads/text/<filename>')
def uploaded_text(filename):
    return send_from_directory(TEXT_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
