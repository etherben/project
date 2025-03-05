
FROM python:3.9-slim


WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


COPY . .


EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]