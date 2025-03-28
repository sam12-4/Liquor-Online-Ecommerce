import pandas as pd
import random
import os

# Define the paths
source_file = 'src/data/products.xlsx'
output_file = 'src/data/products.xlsx'

print(f"Reading Excel file from {source_file}")
# Read the Excel file
df = pd.read_excel(source_file)

# Check if the isTrending column already exists
if 'isTrending' not in df.columns:
    # Add the isTrending column with random True/False values
    # Make approximately 25% of products trending
    df['isTrending'] = [random.random() < 0.25 for _ in range(len(df))]
    print(f"Added isTrending field to {len(df)} products")
    
    # Ensure at least 8 products are trending (for display on homepage)
    min_trending = 8
    trending_count = df['isTrending'].sum()
    
    if trending_count < min_trending:
        # Select random indices to make trending
        non_trending = df[~df['isTrending']].index.tolist()
        additional_needed = min_trending - trending_count
        
        if additional_needed > 0 and len(non_trending) >= additional_needed:
            indices_to_make_trending = random.sample(non_trending, int(additional_needed))
            df.loc[indices_to_make_trending, 'isTrending'] = True
            print(f"Ensured at least {min_trending} products are trending")
    
    # Save the modified Excel file
    df.to_excel(output_file, index=False)
    print(f"Saved updated Excel file to {output_file}")
    
    # Print summary
    trending_count = df['isTrending'].sum()
    print(f"Total products: {len(df)}")
    print(f"Trending products: {trending_count} ({trending_count/len(df)*100:.1f}%)")
else:
    print("isTrending field already exists in the Excel file.") 