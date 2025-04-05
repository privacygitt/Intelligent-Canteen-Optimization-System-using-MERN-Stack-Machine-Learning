from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

app = Flask(__name__)

# Function to analyze order trends
def analyze_orders(order_data):
    df = pd.DataFrame(order_data)

    # Ensure data has the necessary fields
    if 'food_item' not in df.columns or 'order_count' not in df.columns or 'day_of_week' not in df.columns:
        return {"error": "Invalid data format"}

    # Convert categorical day names into numerical values
    day_mapping = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6}
    df['day_numeric'] = df['day_of_week'].map(day_mapping)

    # Select features for clustering
    X = df[['order_count', 'day_numeric']]

    # Apply K-Means clustering
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X)

    # Define cluster meanings
    cluster_meanings = {
        df.groupby('cluster')['order_count'].mean().idxmax(): "High Demand",
        df.groupby('cluster')['order_count'].mean().idxmin(): "Low Demand"
    }

    # Assign cluster labels
    df['demand_category'] = df['cluster'].map(cluster_meanings).fillna("Medium Demand")

    # Generate insights for admin
    insights = []
    for _, row in df.iterrows():
        if row['demand_category'] == "High Demand":
            insights.append(f"Prepare more {row['food_item']} on {row['day_of_week']} as demand is high.")
        elif row['demand_category'] == "Low Demand":
            insights.append(f"Consider removing {row['food_item']} as it is rarely ordered.")

    return {"insights": insights}

# Flask route to accept order data and return insights
@app.route('/analyze-orders', methods=['POST'])
def analyze():
    try:
        data = request.json
        if not data or 'orders' not in data:
            return jsonify({"error": "No order data provided"}), 400
        
        response = analyze_orders(data['orders'])
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
