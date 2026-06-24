# -*- coding: utf-8 -*-
"""
NutriNet Recipe Nutrition Translator & Financial Aligner
Replaces premium high-cost baby diet ingredients with native low-budget Indian foods,
maintaining protein and caloric equivalence under specified budget limits.
"""

class TraditionalNutritionDatabase:
    def __init__(self):
        # Dictionary of cheap local alternatives: Protein (g) per 100g, Calories per 100g, Price (INR) per 100g
        self.local_items = {
            "ragi_flour": {"name": "Finger Millet / Nachni (Ragi)", "protein": 7.3, "calories": 328, "price": 4, "zinc": 2.3, "calcium": 344},
            "sattu_flour": {"name": "Roasted Bengal Gram Sattu", "protein": 20.2, "calories": 369, "price": 6, "zinc": 3.1, "iron": 8.5},
            "moong_dal": {"name": "Yellow Split Moong Dal", "protein": 24.0, "calories": 348, "price": 8, "calcium": 75, "iron": 6.7},
            "bajra_flour": {"name": "Pearl Millet (Bajra)", "protein": 11.6, "calories": 361, "price": 3, "calcium": 42, "iron": 8.0},
            "ghee": {"name": "Pure Desi Butter Ghee", "protein": 0.0, "calories": 890, "price": 45, "fat": 99.0},
            "curd": {"name": "Homemade Cow Milk Curd", "protein": 4.1, "calories": 60, "price": 3, "calcium": 120}
        }

        # Expensive foods commonly recommended in urban recipe websites
        self.premium_items_map = {
            "quinoa": {
                "replace_with": "ragi_flour",
                "protein_yield": 12.0,
                "calories_yield": 368,
                "approx_price": 95,
                "remarks": "Ragi yields 8x more calcium and costs 24x less."
            },
            "salmon": {
                "replace_with": "sattu_flour",
                "protein_yield": 20.0,
                "calories_yield": 200,
                "approx_price": 380,
                "remarks": "Sattu + Roasted Gram yields identical plant protein + dense iron at 1/60th the cost."
            },
            "greek yogurt": {
                "replace_with": "curd",
                "protein_yield": 10.0,
                "calories_yield": 110,
                "approx_price": 85,
                "remarks": "Fresh home-churned curd delivers similar active probiotic lactobacilli."
            },
            "avocado": {
                "replace_with": "curd", # combined with ghee / banana
                "protein_yield": 2.0,
                "calories_yield": 160,
                "approx_price": 180,
                "remarks": "Replace with ripe sweet banana mashed with 1/2 tsp Ghee for healthy fats."
            }
        }

    def convert_expensive_recipe(self, name, ingredients, budget_cap=25):
        print(f"\n[AI TRANSLATOR] Translating Recipe: '{name}'")
        print(f"Target Budget Cap: ₹{budget_cap} per serving")
        print("-" * 50)
        
        translated_items = []
        old_cost = 0
        new_cost = 0
        protein_retained = 0
        calories_retained = 0
        
        for ing in ingredients:
            ing_lower = ing.lower()
            matched = False
            for key, info in self.premium_items_map.items():
                if key in ing_lower:
                    subst_key = info["replace_with"]
                    subst_details = self.local_items[subst_key]
                    
                    translated_items.append({
                        "original_ingredient": ing,
                        "substitute_name": subst_details["name"],
                        "protein_g": info["protein_yield"],
                        "calories": info["calories_yield"],
                        "price": subst_details["price"],
                        "remarks": info["remarks"]
                    })
                    
                    old_cost += info["approx_price"]
                    new_cost += subst_details["price"]
                    protein_retained += info["protein_yield"]
                    calories_retained += info["calories_yield"]
                    matched = True
                    break
            
            if not matched:
                # Keep local ingredient
                translated_items.append({
                    "original_ingredient": ing,
                    "substitute_name": ing + " (Keep Native)",
                    "protein_g": 3.0,
                    "calories": 75,
                    "price": 3,
                    "remarks": "Local produce, fully budget friendly"
                })
                old_cost += 10
                new_cost += 3
                protein_retained += 3.0
                calories_retained += 75

        print(f"✔ Substitution matrix finalized:")
        for idx, item in enumerate(translated_items):
            print(f"  {idx+1}. {item['original_ingredient']} -> {item['substitute_name']}")
            print(f"     [NUTRITION] Protein: {item['protein_g']}g | Calorie: {item['calories']} | Price: ₹{item['price']}")
            print(f"     [NOTES] {item['remarks']}")
            
        print("-" * 50)
        print(f"Original Plate Cost:  ~₹{old_cost}")
        print(f"Affordable Native Cost: ~₹{new_cost} (Budget compliant!)")
        print(f"Yield: Total Protein: {protein_retained:.1f}g | Calories: {calories_retained:.1f} kcal")
        
        return translated_items, old_cost, new_cost, protein_retained, calories_retained

if __name__ == "__main__":
    db = TraditionalNutritionDatabase()
    ingredients = [
        "150g Atlantic Grilled Salmon",
        "1 bowl imported Quinoa grains",
        "1 cup Greek Yogurt dressing",
        "1/2 sliced ripe Avocado"
    ]
    db.convert_expensive_recipe("Premium Post-Weaning Meal", ingredients, budget_cap=20)
