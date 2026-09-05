from flask import request, jsonify
from routes.validations import validate_dishes_ai
from routes.AI.winePrompt import generate_dish_profiles
import itertools


def upload_dishes_ai():
    data = request.get_json()

    if not data or "dishes" not in data:
        return jsonify({
            "error": "Please provide dishes"
        }), 400

    dishes = data["dishes"]

    if not isinstance(dishes, list) or len(dishes) == 0:
        return jsonify({
            "error": "Please provide at least one wine"
        }), 400

    validation_errors = []

    # Validate each wine before sending it to the AI.
    for index, dish in enumerate(dishes):
        errors = validate_dishes_ai(dish)

        if errors:
            validation_errors.append({
                "row": index + 2,
                "errors": errors
            })

    if validation_errors:
        return jsonify({
            "error": "Some dishes contain invalid data",
            "errors": validation_errors
        }), 400

    # Add a temporary row_id so the AI response can be matched back to the correct wine.
    dishes_for_ai = []

    for index, dish in enumerate(dishes):

        dish_for_ai = {
            "row_id": index + 1,
            "dish_name": dish["dish_name"],
            "category": dish["category"],
            "description": dish["description"]
        }
        dishes_for_ai.append(dish_for_ai)

    try:
        # batching in 15 rows max to preserve quality: https://realpython.com/how-to-split-a-python-list-into-chunks/#:~:text=you%20work%20with-,Python%20iterables.,-They%E2%80%99re%20grouped%20into
        ai_profiles = []
        for batch in itertools.batched(dishes_for_ai, 15):
            profiles = generate_dish_profiles(list(batch))
            for profile in profiles:
                ai_profiles.append(profile)

    except Exception as err:
        print("AI dish generation error:", err)

        return jsonify({
            "error": "Could not generate AI wine profiles"
        }), 500

    # nested loop and similar to sendish.py 
    # https://www.geeksforgeeks.org/python/python-nested-loops/
    completed_dishes = []

    for dish_ai in dishes_for_ai:
        row_id_found = False
        for profile in ai_profiles:

            if dish_ai["row_id"] == profile.row_id:   

                dish = dishes[dish_ai["row_id"] - 1]
                dish["colour_wine"] = profile.colour_wine
                dish["body_score"] = profile.body_score
                dish["tannin_score"] = profile.tannin_score
                dish["acidity_score"] = profile.acidity_score
                dish["sweetness_score"] = profile.sweetness_score

                completed_dishes.append(dish)
                row_id_found = True
                break

        if not row_id_found:
            return jsonify({
                "error": f"AI profile missing for wine row {dish_ai['row_id']}"
            }), 500
        
    return jsonify({
        "message": f"AI profiles generated for {len(completed_dishes)} dishes",
        "dishes": completed_dishes
    }), 200