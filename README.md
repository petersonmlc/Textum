# textum_saas.py - Núcleo do SaaS Textum

import os
import re
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import language_tool_python  # Biblioteca para correção gramatical

app = Flask(__name__)

# Configurações
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'docx', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Inicializa o corretor gramatical
tool = language_tool_python.LanguageTool('pt-BR')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_text():
    # Análise de texto via formulário
    text = request.form.get('text', '')
    return analyze(text)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Análise via upload de arquivo
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Processa o arquivo (simplificado)
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        return analyze(text)
    
    return jsonify({'error': 'Tipo de arquivo não permitido'}), 400

def analyze(text):
    # Realiza todas as análises
    grammar_analysis = check_grammar(text)
    style_analysis = check_style(text)
    readability_score = calculate_readability(text)
    
    return jsonify({
        'original_text': text,
        'grammar': grammar_analysis,
        'style': style_analysis,
        'readability': readability_score,
        'suggestions': generate_suggestions(text)
    })

def check_grammar(text):
    matches = tool.check(text)
    return {
        'errors': [{
            'message': match.message,
            'context': match.context,
            'replacements': match.replacements
        } for match in matches],
        'error_count': len(matches)
    }

def check_style(text):
    # Análise simplificada de estilo
    long_sentences = [s for s in re.split(r'[.!?]', text) if len(s.split()) > 25]
    repeated_words = find_repetitions(text)
    
    return {
        'long_sentences': long_sentences,
        'repeated_words': repeated_words,
        'sentence_count': len(re.split(r'[.!?]', text))
    }

# ... (outras funções de análise)

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
