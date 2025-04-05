from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
import pandas as pd

def train_category_model(data):
    # Convert data to DataFrame
    df = pd.DataFrame(data)
    
    # Encode categories
    le = LabelEncoder()
    df['category_encoded'] = le.fit_transform(df['category'])
    
    # Create user-item matrix
    user_item_matrix = df.pivot_table(
        index='user_id',
        columns='category_encoded',
        values='order_count',
        fill_value=0
    )
    
    # Train KNN model
    model = NearestNeighbors(n_neighbors=5, metric='cosine')
    model.fit(user_item_matrix)
    
    return model, le

def get_recommendations(user_id, model, le, user_item_matrix):
    try:
        user_idx = user_item_matrix.index.get_loc(user_id)
        distances, indices = model.kneighbors(user_item_matrix.iloc[user_idx, :].values.reshape(1, -1))
        
        similar_users = user_item_matrix.iloc[indices[0]].index.tolist()
        # Get most common categories from similar users
        # (Implement logic to aggregate categories from similar users)
        return similar_users
    except:
        return []