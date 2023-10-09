from flask import Flask, request, jsonify
from hanspell import spell_checker
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/check_spelling', methods=['POST'])
def check_spelling():
    text = request.json['text']
    print("Received text:", text)
    result = spell_checker.check(text)

    # Hanspell의 응답 내용을 로그로 출력
    print("Hanspell Result:", result.as_dict())  # Hanspell의 결과를 딕셔너리 형태로 출력

    return jsonify({"corrected_text": result.checked})


if __name__ == '__main__':
    app.run(port=5000)
