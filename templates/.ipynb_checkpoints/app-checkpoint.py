from flask import Flask, render_template, request, jsonify
import re
import random
import string

app = Flask(__name__)

# =========================
# TIPS
# =========================

TIPS = [
    "Never reuse passwords.",
    "Enable MFA for security.",
    "Avoid personal info in passwords.",
    "Use password manager.",
    "Avoid phishing links.",
    "Update passwords regularly."
]

# =========================
# COMMON PASSWORDS
# =========================

COMMON = ["123456", "password", "password123", "qwerty", "abc123", "111111"]

# =========================
# ENHANCE PASSWORD
# =========================

def enhance(password):

    p = password

    map_char = {
        "a": "@", "i": "!", "o": "0",
        "s": "$", "e": "3", "l": "1", "t": "7"
    }

    for k, v in map_char.items():
        p = p.replace(k, v)
        p = p.replace(k.upper(), v)

    if len(p) > 0:
        p = p[0].upper() + p[1:]

    if not re.search(r'\d', p):
        p += str(random.randint(10, 99))

    if not re.search(r'[!@#$%^&*]', p):
        p += random.choice("!@#$%^&*")

    return p

# =========================
# ANALYZE
# =========================

def analyze(password):

    score = 0
    suggestions = []

    if len(password) >= 12:
        score += 25
    elif len(password) >= 8:
        score += 15
    else:
        suggestions.append("Use at least 12 characters.")

    if re.search(r'[A-Z]', password):
        score += 15
    else:
        suggestions.append("Add uppercase letters.")

    if re.search(r'[a-z]', password):
        score += 15
    else:
        suggestions.append("Add lowercase letters.")

    if re.search(r'\d', password):
        score += 15
    else:
        suggestions.append("Add numbers.")

    if re.search(r'[!@#$%^&*]', password):
        score += 15
    else:
        suggestions.append("Add special characters.")

    if password.lower() in COMMON:
        score -= 20
        suggestions.append("Avoid common passwords.")

    if score < 40:
        strength = "Weak"
    elif score < 75:
        strength = "Medium"
    else:
        strength = "Strong"

    risks = (
        ["Brute Force", "Dictionary Attack"] if strength == "Weak"
        else ["Brute Force"] if strength == "Medium"
        else ["Low Risk"]
    )

    if score <= 20:
        crack = "Instantly"
    elif score <= 40:
        crack = "Minutes"
    elif score <= 60:
        crack = "Days"
    elif score <= 80:
        crack = "Months"
    else:
        crack = "Years"

    return {
        "score": max(0, score),
        "strength": strength,
        "risks": risks,
        "suggestions": suggestions,
        "crack_time": crack,
        "recommended": enhance(password) if strength != "Strong" else ""
    }

# =========================
# ROUTES
# =========================

@app.route("/")
def home():
    return render_template("index.html", tip=random.choice(TIPS))


@app.route("/analyze", methods=["POST"])
def analyze_route():

    data = request.get_json()
    password = data.get("password", "")

    return jsonify(analyze(password))


@app.route("/tip")
def tip():
    return jsonify({"tip": random.choice(TIPS)})


if __name__ == "__main__":
    app.run(debug=True)