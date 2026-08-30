from flask import request, jsonify
from routes.validations import validate_wine_ai
from routes.AI.winePrompt import generate_wine_profiles
import itertools


def upload_wines_ai():
    data = request.get_json()

    if not data or "wines" not in data:
        return jsonify({
            "error": "Please provide wines"
        }), 400

    wines = data["wines"]

    if not isinstance(wines, list) or len(wines) == 0:
        return jsonify({
            "error": "Please provide at least one wine"
        }), 400

    validation_errors = []

    # Validate each wine before sending it to the AI.
    for index, wine in enumerate(wines):
        errors = validate_wine_ai(wine)

        if errors:
            validation_errors.append({
                "row": index + 2,
                "errors": errors
            })

    if validation_errors:
        return jsonify({
            "error": "Some wines contain invalid data",
            "errors": validation_errors
        }), 400

    # Add a temporary row_id so the AI response can be matched back to the correct wine.
    wines_for_ai = []

    for index, wine in enumerate(wines):

        wine_for_ai = {
            "row_id": index + 1,
            "name": wine["name"],
            "wine_type": wine["wine_type"],
            "grape": wine["grape"],
            "country": wine["country"],
            "region": wine["region"],
            "year": wine["year"]
        }
        wines_for_ai.append(wine_for_ai)

    try:
        # batching in 15 rows max to preserve quality: https://realpython.com/how-to-split-a-python-list-into-chunks/#:~:text=you%20work%20with-,Python%20iterables.,-They%E2%80%99re%20grouped%20into
        ai_profiles = []
        for batch in itertools.batched(wines_for_ai, 15):
            profiles = generate_wine_profiles(list(batch))
            for profile in profiles:
                ai_profiles.append(profile)

    except Exception as err:
        print("AI wine generation error:", err)

        return jsonify({
            "error": "Could not generate AI wine profiles"
        }), 500

    # nested loop and similar to sendish.py 
    # https://www.geeksforgeeks.org/python/python-nested-loops/
    completed_wines = []

    for wine_ai in wines_for_ai:
        row_id_found = False
        for profile in ai_profiles:

            if wine_ai["row_id"] == profile.row_id:   

                wine = wines[wine_ai["row_id"] - 1]
                wine["description"] = profile.description
                wine["body_score"] = profile.body_score
                wine["tannin_score"] = profile.tannin_score
                wine["acidity_score"] = profile.acidity_score
                wine["sweetness_score"] = profile.sweetness_score

                completed_wines.append(wine)
                row_id_found = True
                break

        if not row_id_found:
            return jsonify({
                "error": f"AI profile missing for wine row {wine_ai['row_id']}"
            }), 500
        
    return jsonify({
        "message": f"AI profiles generated for {len(completed_wines)} wines",
        "wines": completed_wines
    }), 200