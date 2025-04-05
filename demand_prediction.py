import sys
import json
import pandas as pd
import matplotlib.pyplot as plt
from prophet import Prophet

# Read input JSON from Node.js
data = json.loads(sys.stdin.read())

# Convert to DataFrame
df = pd.DataFrame(data)

# Check if "date" column exists and has valid values
if "date" not in df.columns or df["date"].isnull().all():
    print(json.dumps({"error": "Missing or invalid date column in input data"}))
    sys.exit(1)  # Stop execution

# Handle date conversion properly
try:
    df["date"] = pd.to_datetime(df["date"], errors='coerce')  # Coerce invalid dates to NaT
    df = df.dropna(subset=["date"])  # Remove rows with NaT values
except Exception as e:
    print(json.dumps({"error": f"Date conversion error: {str(e)}"}))
    sys.exit(1)

# Rename columns for Prophet
df.rename(columns={"date": "ds", "order_count": "y"}, inplace=True)

# Check for NaN values after renaming
if df.isnull().values.any():
    print(json.dumps({"error": "Data contains NaN values after renaming"}))
    sys.exit(1)

# Initialize Prophet model
model = Prophet()
model.fit(df)

# Create future dates (next 7 days)
future = model.make_future_dataframe(periods=7)

# Predict demand
forecast = model.predict(future)

# Select required columns
result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(
    columns={"ds": "date", "yhat": "predicted_orders", "yhat_lower": "lower_bound", "yhat_upper": "upper_bound"}
)

# Convert date to string format for JSON output
result["date"] = result["date"].dt.strftime("%Y-%m-%d")

# Convert to JSON and print
print(result.to_json(orient="records"))
