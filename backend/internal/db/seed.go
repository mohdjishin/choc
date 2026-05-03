package db

import (
	"context"
	"log"
	"time"

	"github.com/muhammedjishinjamal/choc/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

func SeedDefaultUsers(db *MongoClient) error {
	collection := db.Database.Collection("users")

	users := []struct {
		email    string
		password string
		role     models.Role
	}{
		{
			email:    "superadmin@choc.com",
			password: "admin123",
			role:     models.RoleSuperAdmin,
		},
		{
			email:    "admin@choc.com",
			password: "admin123",
			role:     models.RoleAdmin,
		},
	}

	for _, u := range users {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		filter := bson.M{"email": u.email}
		update := bson.M{
			"$set": bson.M{
				"email":      u.email,
				"password":   string(hashedPassword),
				"role":       u.role,
				"updated_at": time.Now(),
			},
			"$setOnInsert": bson.M{
				"created_at": time.Now(),
			},
		}

		opts := options.Update().SetUpsert(true)
		_, err = collection.UpdateOne(context.Background(), filter, update, opts)
		if err != nil {
			return err
		}
		log.Printf("Default user %s (%s) seeded/updated successfully.\n", u.email, u.role)
	}

	return nil
}
func SeedProducts(db *MongoClient) error {
	collection := db.Database.Collection("products")

	// Check if specific product exists to avoid double seeding
	var existing models.Product
	err := collection.FindOne(context.Background(), bson.M{"name": "Noir Eclipse"}).Decode(&existing)
	if err == nil {
		return nil
	}

	products := []models.Product{
		{
			Name:        "Noir Eclipse",
			Category:    "Truffles",
			Price:       45.00,
			Stock:       120,
			Description: "An intense 85% dark chocolate ganache, hand-rolled and dusted with volcanic cocoa and 24K edible gold leaf.",
			Images:      []string{"http://localhost:8081/public/seed_assets/noir_eclipse.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Single-origin 85% Dark Cacao, Organic Cocoa Butter, Raw Cane Sugar, Volcanic Cocoa Dust, 24K Edible Gold Leaf. May contain traces of forest nuts."},
				{Title: "Storage & Care", Content: "Keep in a cool, dry atelier environment between 16-18°C. Avoid direct sunlight and strong aromas."},
				{Title: "Shipping & Presentation", Content: "Conveyed in temperature-controlled sustainable packaging. Please allow 24-48h for artisan preparation."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Volcanic Cacao Terroir", Tag: "THE ORIGIN", Content: "Harvested from remote volcanic slopes, our cacao beans absorb the mineral richness of the earth, resulting in a profile of deep smoke and wild berry notes that define the Noir Eclipse experience.", Image: "http://localhost:8081/public/seed_assets/editorial_cacao.png"},
				{Type: "mixed", Title: "The Alchemy of Dark", Tag: "THE CRAFT", Content: "In our atelier, the raw beans undergo a precise 72-hour conching process. This ritual of time and temperature transforms the volcanic minerals into a silk-textured masterpiece of profound intensity.", Image: "http://localhost:8081/public/seed_assets/editorial_craft.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Midnight Sea Salt",
			Category:    "Truffles",
			Price:       42.00,
			Stock:       150,
			Description: "Velvety dark chocolate truffles infused with charcoal-smoked sea salt crystals for a profound sensory contrast.",
			Images:      []string{"http://localhost:8081/public/seed_assets/midnight_salt.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "70% Dark Cacao, Maldon Smoked Sea Salt, Organic Cream, Vanilla Bean. Contains Dairy."},
				{Title: "Storage & Care", Content: "Preserve in a low-humidity environment to maintain the crystalline structure of the salt."},
				{Title: "Shipping & Presentation", Content: "Express climate-stable transit recommended."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Salinity Ritual", Tag: "PROVENANCE", Content: "We utilize charcoal-smoked crystals harvested from ancient coastal salt pans. The sharp salinity pierces the rich ganache, creating a symphony of sensory peaks and valleys.", Image: "http://localhost:8081/public/seed_assets/editorial_cacao.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Saffron Silk",
			Category:    "Ganache",
			Price:       55.00,
			Stock:       85,
			Description: "Velvety white chocolate infused with rare Persian saffron threads and a hint of wild mountain honey.",
			Images:      []string{"http://localhost:8081/public/seed_assets/saffron_silk.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Premium Ivory Cacao Butter, Whole Milk Solids, Rare Persian Saffron Threads, Wild Mountain Honey, Pure Vanilla Bean. Contains Dairy."},
				{Title: "Storage & Care", Content: "Highly sensitive to temperature. Best preserved in its original silk-lined box at a constant 17°C."},
				{Title: "Shipping & Presentation", Content: "Express white-glove delivery within the UAE to preserve the delicate aromatic profile of the saffron."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Persian Red Gold", Tag: "INGREDIENTS", Content: "Rare saffron threads are hand-plucked at dawn and infused into our white chocolate ganache for exactly forty-eight hours to achieve the perfect silk texture and golden hue.", Image: "http://localhost:8081/public/seed_assets/editorial_honey.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Amber Nectar",
			Category:    "Ganache",
			Price:       48.00,
			Stock:       95,
			Description: "Honey-gold ganache encased in a thin white chocolate shell, capturing the essence of a sun-drenched meadow.",
			Images:      []string{"http://localhost:8081/public/seed_assets/amber_nectar.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Raw Forest Honey, White Cacao Shell, Organic Cream, Pollen Dust. Contains Dairy."},
				{Title: "Storage & Care", Content: "Avoid refrigeration; store in a curated cool-cabinet."},
				{Title: "Shipping & Presentation", Content: "Standard luxury packaging."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Wild Mountain Apiary", Tag: "THE SOURCE", Content: "Our honey is sourced from remote mountain hives, where the bees forage on wild jasmine and desert roses, imparting a unique floral profile to the amber ganache heart.", Image: "http://localhost:8081/public/seed_assets/editorial_honey.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Emerald Pistachio",
			Category:    "Ganache",
			Price:       52.00,
			Stock:       110,
			Description: "Vibrant Sicilian pistachio paste blended with white chocolate ganache, topped with hand-crushed emerald nuts.",
			Images:      []string{"http://localhost:8081/public/seed_assets/emerald_pistachio.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Sicilian Pistachios, White Chocolate, Nut Oils, Sea Salt. Contains Nuts and Dairy."},
				{Title: "Storage & Care", Content: "Maintain at 18°C for optimal texture and flavor release."},
				{Title: "Shipping & Presentation", Content: "International-grade protective packaging."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Crushing Ritual", Tag: "PROVENANCE", Content: "Every pistachio is inspected for color and oil content before being slow-roasted and hand-crushed to preserve its vibrant green hue and buttery texture.", Image: "http://localhost:8081/public/seed_assets/editorial_craft.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Heritage Medjool",
			Category:    "Pralines",
			Price:       35.00,
			Stock:       200,
			Description: "Premium organic Medjool dates stuffed with slow-roasted almond praline and dipped in silk-textured milk chocolate.",
			Images:      []string{"http://localhost:8081/public/seed_assets/heritage_medjool.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Organic Grade-A Medjool Dates, Slow-Roasted Valencia Almonds, 45% Milk Chocolate, Sea Salt Crystals. Contains Nuts and Dairy."},
				{Title: "Storage & Care", Content: "Store in an airtight container to preserve the crispness of the almond praline center."},
				{Title: "Shipping & Presentation", Content: "Standard luxury packaging. Resilient to ambient transit."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Ancient Cultivation", Tag: "THE SOURCE", Content: "Our dates are harvested from centuries-old groves, where the desert sun concentrates the natural sugars into a deep, caramel-like richness that anchors the praline heart.", Image: "http://localhost:8081/public/seed_assets/editorial_palms.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Velvet Rose",
			Category:    "Pralines",
			Price:       38.00,
			Stock:       130,
			Description: "Rose-water infused praline with a delicate floral heart, garnished with dried damask rose petals.",
			Images:      []string{"http://localhost:8081/public/seed_assets/velvet_rose.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Damask Rose Water, Hazelnut Praline, Ruby Chocolate, Dried Petals. Contains Nuts."},
				{Title: "Storage & Care", Content: "Keep away from strong floral or spice aromas that may interfere with the rose notes."},
				{Title: "Shipping & Presentation", Content: "Boutique-standard transit."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Damask Rose Distillation", Tag: "THE ART", Content: "We distill our own rose water from fresh damask petals, ensuring a pure, delicate aroma that perfectly complements the rich hazelnut praline heart and ruby chocolate shell.", Image: "http://localhost:8081/public/seed_assets/editorial_honey.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Boutique Signature Box",
			Category:    "Boutique Boxes",
			Price:       250.00,
			Stock:       50,
			Description: "A curated 12-piece journey through our most celebrated confectionery masterpieces. The ultimate ritual of elegance.",
			Images:      []string{"http://localhost:8081/public/seed_assets/signature_box.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "A curated selection featuring Single-Origin Cacao, Persian Saffron, Heritage Dates, Roasted Pralines, and Volcanic Truffles."},
				{Title: "Storage & Care", Content: "The archive should be stored away from heat. We recommend tasting within 14 days of acquisition."},
				{Title: "Shipping & Presentation", Content: "Signature Maison packaging with priority temperature-controlled transit."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Presentation Ritual", Tag: "THE EXPERIENCE", Content: "Each box is a symphony of flavors, hand-selected by our master chocolatier to represent the pinnacle of regional excellence and artisanal skill. A journey through the sands of time.", Image: "http://localhost:8081/public/seed_assets/editorial_unboxing.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "The Ramadan Collection",
			Category:    "Seasonal",
			Price:       450.00,
			Stock:       30,
			Description: "A magnificent laser-cut wooden box containing 36 pieces of heritage-inspired dates and artisanal chocolates.",
			Images:      []string{"http://localhost:8081/public/seed_assets/ramadan_box.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Assorted Medjool Dates, Saffron Ganaches, Pistachio Truffles, Rose Pralines. Contains Nuts and Dairy."},
				{Title: "Storage & Care", Content: "A centerpiece box designed for display; keep in a climate-controlled room."},
				{Title: "Shipping & Presentation", Content: "White-glove concierge delivery available within the region."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Laser-Cut Heritage", Tag: "THE ARTISTRY", Content: "Our laser-cut wooden boxes are pieces of art in themselves, designed to be kept as keepsakes. Every detail, from the silk lining to the gold foil accents, reflects the spirit of the season.", Image: "http://localhost:8081/public/seed_assets/editorial_unboxing.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	for _, p := range products {
		_, err := collection.InsertOne(context.Background(), p)
		if err != nil {
			return err
		}
	}

	log.Println("Initial products seeded successfully.")
	return nil
}
