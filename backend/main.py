from config import app


@app.route('/')
def index():
    return 'Hello World!'

# Run the app only if the script is run directly and not imported
if __name__ == '__main__':
    app.run(debug=True)