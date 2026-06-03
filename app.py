from flask import Flask, render_template, request, jsonify
import re
import random
import string

app = Flask(__name__)

# ==========================================
# CYBER SECURITY AWARENESS TIPS
# ==========================================

AWARENESS_TIPS = [
    "Never reuse the same password across multiple accounts.",
    "Enable Multi-Factor Authentication (MFA) whenever possible.",
    "Avoid using personal information in passwords.",
    "Use a password manager to store passwords securely.",
    "Update passwords regularly for important accounts.",
    "Do not share passwords with others.",
    "Be cautious of phishing emails requesting login credentials."
]

# ==========================================
# COMMON WEAK PASSWORDS
# ==========================================

COMMON_PASSWORDS = [
    "123456",
    "password",
    "password123",
    "qwerty",
    "abc123",
    "111111",
    "admin",
    "welcome",
    "letmein"
]

# ==========================================
# PASSWORD ANALYSIS ENGINE
# ==========================================

def analyze_password(password):

    score = 0
    suggestions = []

    # Length
    if len(password) >= 12:
        score += 25
    elif len(password) >= 8:
        score += 15
    else:
        suggestions.append("Increase password length to at least 12 characters.")

    # Uppercase
    if re.search(r'[A-Z]', password):
        score += 15
    else:
        suggestions.append("Add uppercase letters.")

    # Lowercase
    if re.search(r'[a-z]', password):
        score += 15
    else:
        suggestions.append("Add lowercase letters.")

    # Numbers
    if re.search(r'\d', password):
        score += 15
    else:
        suggestions.append("Include numbers.")

    # Special Characters
    if re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        score += 15
    else:
        suggestions.append("Include special characters.")

    # Common Password Check
    if password.lower() not in COMMON_PASSWORDS:
        score += 15
    else:
        suggestions.append("Avoid common passwords.")

    # Classification
    if score < 40:
        strength = "Weak"
        color = "danger"

    elif score < 75:
        strength = "Medium"
        color = "warning"

    else:
        strength = "Strong"
        color = "success"

    # Risk Analysis
    risks = []

    if strength == "Weak":
        risks = [
            "Dictionary Attack",
            "Brute Force Attack",
            "Credential Stuffing"
        ]

    elif strength == "Medium":
        risks = [
            "Brute Force Attack"
        ]

    else:
        risks = [
            "Low Risk"
        ]

    # Crack Time Estimation
    if score <= 20:
        crack_time = "Instantly"

    elif score <= 40:
        crack_time = "Few Minutes"

    elif score <= 60:
        crack_time = "Several Days"

    elif score <= 80:
        crack_time = "Several Months"

    else:
        crack_time = "Hundreds of Years"

    return {
        "score": score,
        "strength": strength,
        "color": color,
        "suggestions": suggestions,
        "risks": risks,
        "crack_time": crack_time
    }

# ==========================================
# PASSWORD GENERATOR
# ==========================================

def generate_password(length=16):

    characters = (
        string.ascii_letters +
        string.digits +
        "!@#$%^&*()"
    )

    return ''.join(
        random.choice(characters)
        for _ in range(length)
    )

# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():

    return render_template(
        "index.html",
        tip=random.choice(AWARENESS_TIPS)
    )

# ==========================================
# ANALYZE PASSWORD
# ==========================================

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    password = data.get("password", "")

    result = analyze_password(password)

    return jsonify(result)

# ==========================================
# GENERATE PASSWORD
# ==========================================

@app.route("/generate")
def generate():

    password = generate_password()

    return jsonify({
        "password": password
    })

# ==========================================
# REFRESH SECURITY TIP
# ==========================================

@app.route("/tip")
def get_tip():

    return jsonify({
        "tip": random.choice(AWARENESS_TIPS)
    })

# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == "__main__":
    app.run(
        debug=True
    )