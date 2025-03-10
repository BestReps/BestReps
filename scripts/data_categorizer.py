import json
from collections import defaultdict

# Step 1: Load data from data.json
def load_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

# Step 2: Analyze terms in the data
def analyze_terms(data):
    term_frequency = defaultdict(int)
    for item in data:
        name = item["name"].lower()
        terms = name.split()  # Split name into individual terms
        for term in terms:
            term_frequency[term] += 1
    return term_frequency

# Step 3: Suggest potential categories
def suggest_categories(term_frequency):
    print("Common terms found in the data:")
    for term, frequency in sorted(term_frequency.items(), key=lambda x: x[1], reverse=True):
        print(f"{term}: {frequency} occurrences")
    
    # Suggest categories based on common terms
    suggestions = {
        "shoes": ["airforce", "yeezy", "sneakers", "boots"],
        "shirts": ["t-shirt", "shirt", "polo", "sweatshirt"],
        "pants": ["jeans", "trousers", "cargos", "sweatpants"],
        "accessories": ["cap", "hat", "belt", "watch"]
    }
    
    print("\nSuggested categories and keywords:")
    for category, keywords in suggestions.items():
        print(f"{category}: {', '.join(keywords)}")
    
    return suggestions

# Step 4: Define custom categories
def define_categories(suggestions):
    categories = {}
    print("\nDefine your categories and keywords:")
    for category, keywords in suggestions.items():
        user_input = input(f"Enter keywords for '{category}' (comma-separated, or press Enter to use suggestions): ")
        if user_input.strip():
            categories[category] = [keyword.strip() for keyword in user_input.split(",")]
        else:
            categories[category] = keywords
    return categories

# Step 5: Categorize the data
def categorize_data(data, categories):
    categorized_data = []
    for item in data:
        name = item["name"].lower()
        category = "other"  # Default category
        for cat, keywords in categories.items():
            if any(keyword in name for keyword in keywords):
                category = cat
                break
        item["category"] = category
        categorized_data.append(item)
    return categorized_data

# Main function
def main():
    # Step 1: Load data
    data = load_data("data.json")
    
    # Step 2: Analyze terms
    term_frequency = analyze_terms(data)
    
    # Step 3: Suggest categories
    suggested_categories = suggest_categories(term_frequency)
    
    # Step 4: Define custom categories
    categories = define_categories(suggested_categories)
    
    # Step 5: Categorize the data
    categorized_data = categorize_data(data, categories)
    
    # Save categorized data to JSON file
    with open("categorized_data.json", "w", encoding="utf-8") as f:
        json.dump(categorized_data, f, ensure_ascii=False, indent=2)
    
    print("\nCategorized data saved to 'categorized_data.json'.")

if __name__ == "__main__":
    main()