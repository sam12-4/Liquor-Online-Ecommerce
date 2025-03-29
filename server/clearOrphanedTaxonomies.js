const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define models
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const countrySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const varietalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const typeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);
const Country = mongoose.model('Country', countrySchema);
const Varietal = mongoose.model('Varietal', varietalSchema);
const Type = mongoose.model('Type', typeSchema);

// Function to clean up orphaned entries
async function cleanupOrphanedTaxonomies() {
  try {
    console.log('Starting cleanup of orphaned taxonomy entries...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/liquor-online');
    console.log('Connected to MongoDB');
    
    const collections = [
      { name: 'categories', model: Category },
      { name: 'brands', model: Brand },
      { name: 'countries', model: Country },
      { name: 'varietals', model: Varietal },
      { name: 'types', model: Type }
    ];
    
    for (const { name, model } of collections) {
      try {
        console.log(`\nProcessing ${name} collection...`);
        
        // First, get all DB items
        const dbItems = await model.find({});
        console.log(`Found ${dbItems.length} items in ${name} collection`);
        
        // Then, read from JSON file
        const jsonPath = path.join(__dirname, 'public', 'taxonomy', `${name}.json`);
        
        if (!fs.existsSync(jsonPath)) {
          console.log(`Warning: ${jsonPath} doesn't exist, skipping`);
          continue;
        }
        
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`Found ${jsonData.length} items in ${name}.json file`);
        
        // Create a Set of lowercase names from the JSON file for efficient lookup
        const jsonNamesLower = new Set(jsonData.map(item => 
          typeof item === 'string' ? item.toLowerCase().trim() : String(item).toLowerCase().trim()
        ));
        
        // Find items in DB that aren't in the JSON file (orphaned entries)
        const orphanedItems = dbItems.filter(item => 
          !jsonNamesLower.has(item.name.toLowerCase().trim())
        );
        
        console.log(`Found ${orphanedItems.length} orphaned entries in ${name} collection`);
        
        if (orphanedItems.length > 0) {
          console.log('Orphaned entries:');
          orphanedItems.forEach(item => {
            console.log(`- ${item.name}`);
          });
          
          const orphanedIds = orphanedItems.map(item => item._id);
          const result = await model.deleteMany({ _id: { $in: orphanedIds } });
          console.log(`Removed ${result.deletedCount} orphaned entries from ${model.modelName} collection`);
        }
        
        // Check for duplicates
        const nameCounts = {};
        dbItems.forEach(item => {
          const lowerName = item.name.toLowerCase().trim();
          nameCounts[lowerName] = (nameCounts[lowerName] || 0) + 1;
        });
        
        const duplicates = Object.entries(nameCounts)
          .filter(([_, count]) => count > 1)
          .map(([name]) => name);
        
        if (duplicates.length > 0) {
          console.log(`Found ${duplicates.length} duplicate entries in ${name} collection`);
          
          for (const lowerName of duplicates) {
            const items = await model.find({});
            const matchingItems = items.filter(item => 
              item.name.toLowerCase().trim() === lowerName
            );
            
            if (matchingItems.length > 1) {
              // Keep the first one, delete the rest
              const [keeper, ...duplicates] = matchingItems;
              const duplicateIds = duplicates.map(dup => dup._id);
              
              const deleteResult = await model.deleteMany({ _id: { $in: duplicateIds } });
              console.log(`Kept "${keeper.name}" and removed ${deleteResult.deletedCount} duplicates with the same name (case-insensitive)`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${name} collection:`, error);
      }
    }
    
    console.log('\nCleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupOrphanedTaxonomies(); 