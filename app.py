from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__, template_folder='.')  # Указываем, что шаблоны находятся в корне проекта

# Главная страница
@app.route('/')
def index():
    return render_template('index.html')  # Путь к шаблону в корне проекта

# Страница логина
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Пример простой проверки логина
        if username == 'admin' and password == 'password':
            session['username'] = username
            return redirect(url_for('dashboard'))
        else:
            return 'Неверные данные для входа!', 401
    
    return render_template('login.html')  # Путь к шаблону логина в корне проекта

# Страница после успешного логина
@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return f'Привет, {session["username"]}!'
    return redirect(url_for('login'))

# Страница для выхода
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.secret_key = 'your_secret_key'  # Нужно для работы сессий
    app.run(debug=True, host='0.0.0.0', port=10000)  # Указываем адрес и порт
