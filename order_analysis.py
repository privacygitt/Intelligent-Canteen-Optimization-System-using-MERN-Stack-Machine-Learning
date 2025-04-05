import sys
import json
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Any
from dataclasses import dataclass, asdict
import logging
from scipy import stats

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DemandItem:
    item: str
    order_count: int
    z_score: float = 0.0

class OrderAnalyzer:
    def __init__(self, n_clusters: int = 3):
        """
        Initialize the OrderAnalyzer with the specified number of clusters.
        
        Args:
            n_clusters (int): Number of clusters for demand categorization
        """
        self.n_clusters = n_clusters
        self.scaler = StandardScaler()
        self.kmeans = KMeans(
            n_clusters=n_clusters,
            random_state=42,
            n_init=10
        )

    def validate_data(self, data: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Validate and prepare input data.
        
        Args:
            data: List of dictionaries containing order data
            
        Returns:
            pd.DataFrame: Validated and prepared DataFrame
        """
        if not data:
            raise ValueError("Empty input data")

        df = pd.DataFrame(data)
        required_columns = {'item', 'order_count'}
        
        if not required_columns.issubset(df.columns):
            raise ValueError(f"Missing required columns: {required_columns - set(df.columns)}")

        # Convert order_count to numeric, replacing invalid values with 0
        df['order_count'] = pd.to_numeric(df['order_count'], errors='coerce').fillna(0).astype(int)
        
        # Remove duplicates and negative values
        df = df[df['order_count'] >= 0].drop_duplicates()

        return df

    def analyze_demand(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze demand patterns using multiple statistical approaches.
        
        Args:
            df: Prepared DataFrame with order data
            
        Returns:
            Dict containing analysis results
        """
        # Scale the data
        scaled_data = self.scaler.fit_transform(df[['order_count']])
        
        # Calculate z-scores for statistical categorization
        df['z_score'] = stats.zscore(df['order_count'])
        
        # Perform k-means clustering
        df['cluster'] = self.kmeans.fit_predict(scaled_data)
        
        # Calculate demand thresholds using percentiles
        thresholds = {
            'high': df['order_count'].quantile(0.75),
            'medium': df['order_count'].quantile(0.50),
            'low': df['order_count'].quantile(0.25)
        }
        
        # Categorize items based on multiple criteria
        demand_categories = {
            'high_demand': df[df['order_count'] > thresholds['high']],
            'medium_demand': df[(df['order_count'] > thresholds['low']) & 
                              (df['order_count'] <= thresholds['high'])],
            'low_demand': df[df['order_count'] <= thresholds['low']]
        }
        
        # Create result dictionary with detailed statistics
        result = {
            category: [
                asdict(DemandItem(
                    item=row['item'],
                    order_count=row['order_count'],
                    z_score=row['z_score']
                ))
                for _, row in data.iterrows()
            ]
            for category, data in demand_categories.items()
        }
        
        # Add statistical metrics
        result['metrics'] = {
            'thresholds': thresholds,
            'total_items': len(df),
            'mean_order_count': float(df['order_count'].mean()),
            'median_order_count': float(df['order_count'].median()),
            'std_dev_order_count': float(df['order_count'].std())
        }
        
        return result

def main():
    try:
        # Read and parse input data
        raw_data = sys.stdin.read()
        if not raw_data:
            raise ValueError("No input data provided")
        
        data = json.loads(raw_data)
        
        # Initialize analyzer and process data
        analyzer = OrderAnalyzer()
        df = analyzer.validate_data(data)
        result = analyzer.analyze_demand(df)
        
        # Output results
        print(json.dumps(result, indent=2))
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON input: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error processing data: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
